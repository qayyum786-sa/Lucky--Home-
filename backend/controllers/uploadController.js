exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }
    const paths = req.files.map((f) => `/uploads/images/${f.filename}`);
    res.json({ success: true, message: `${paths.length} image(s) uploaded`, paths });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadDocs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No documents uploaded' });
    }
    const paths = req.files.map((f) => `/uploads/docs/${f.filename}`);
    res.json({ success: true, message: `${paths.length} document(s) uploaded`, paths });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
