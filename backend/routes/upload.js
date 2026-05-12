const router = require('express').Router();
const { uploadImages, uploadDocs } = require('../config/multer');
const ctrl = require('../controllers/uploadController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/images', authenticate, adminOnly, uploadImages.array('images', 10), ctrl.uploadImages);
router.post('/documents', authenticate, adminOnly, uploadDocs.array('documents', 5), ctrl.uploadDocs);

module.exports = router;
