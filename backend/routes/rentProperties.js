const router = require('express').Router();
const ctrl = require('../controllers/rentPropertyController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', authenticate, adminOnly, ctrl.create);
router.put('/:id', authenticate, adminOnly, ctrl.update);
router.delete('/:id', authenticate, adminOnly, ctrl.remove);

module.exports = router;
