const { User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already exists' });
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({ success: true, message: 'User created', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, email, password, role } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (role) updates.role = role;
    await user.update(updates);
    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { BuyProperty, RentProperty, ContactEnquiry } = require('../models');
    const [totalBuy, totalRent, totalEnquiries, totalUsers, newEnquiries] = await Promise.all([
      BuyProperty.count(),
      RentProperty.count(),
      ContactEnquiry.count(),
      User.count(),
      ContactEnquiry.count({ where: { status: 'new' } }),
    ]);
    res.json({ success: true, data: { totalBuy, totalRent, totalEnquiries, totalUsers, newEnquiries } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
