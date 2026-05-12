const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/stats', authenticate, adminOnly, ctrl.getStats);
router.get('/', authenticate, adminOnly, ctrl.getAll);
router.post('/', authenticate, adminOnly, ctrl.create);
router.put('/:id', authenticate, adminOnly, ctrl.update);
router.delete('/:id', authenticate, adminOnly, ctrl.remove);

module.exports = router;
