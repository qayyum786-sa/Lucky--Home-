const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(__dirname, '../uploads/images'));
ensureDir(path.join(__dirname, '../uploads/docs'));

// Image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/images'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img_${uuidv4()}${ext}`);
  },
});

// Document storage
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/docs'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `doc_${uuidv4()}${ext}`);
  },
});

// File filters
const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed for images'), false);
  }
};

const docFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf files are allowed for documents'), false);
  }
};

const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 },
});

const uploadDocs = multer({
  storage: docStorage,
  fileFilter: docFilter,
  limits: { fileSize: parseInt(process.env.MAX_DOC_SIZE) || 10 * 1024 * 1024 },
});

/**
 * Safely delete a single file.
 * Works on Windows (EBUSY/EPERM) by retrying up to 3 times with a short delay.
 * Never throws — logs a warning and moves on if the file can't be deleted.
 *
 * @param {string} filePath  - path stored in DB, e.g. "/uploads/images/img_xxx.jpg"
 */
const deleteFile = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return;

  // Strip leading slash and resolve to absolute path
  const relative = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.resolve(path.join(__dirname, '..', relative));

  // Safety guard: only delete files inside the uploads directory
  const uploadsRoot = path.resolve(path.join(__dirname, '..', 'uploads'));
  if (!fullPath.startsWith(uploadsRoot)) {
    console.warn(`[deleteFile] Blocked attempt to delete outside uploads: ${fullPath}`);
    return;
  }

  // Check the file is actually a file (not a directory)
  try {
    if (!fs.existsSync(fullPath)) return; // already gone, that's fine
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      console.warn(`[deleteFile] Path is not a file, skipping: ${fullPath}`);
      return;
    }
  } catch {
    return; // can't stat it — probably already deleted
  }

  // Attempt deletion with up to 3 retries (helps with Windows EBUSY)
  const tryDelete = (attempts) => {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      if ((err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') && attempts > 0) {
        setTimeout(() => tryDelete(attempts - 1), 200);
      } else if (err.code !== 'ENOENT') {
        // ENOENT = already deleted — ignore. Anything else, log it.
        console.warn(`[deleteFile] Could not delete ${fullPath}: ${err.message}`);
      }
    }
  };

  tryDelete(3);
};

module.exports = { uploadImages, uploadDocs, deleteFile };
