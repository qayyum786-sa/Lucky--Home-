const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', ctrl.submit);
router.get('/', authenticate, adminOnly, ctrl.getAll);
router.get('/:id', authenticate, adminOnly, ctrl.getOne);
router.patch('/:id/status', authenticate, adminOnly, ctrl.updateStatus);

module.exports = router;
