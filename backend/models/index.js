const sequelize = require('../config/database');
const User = require('./User');
const BuyProperty = require('./BuyProperty');
const RentProperty = require('./RentProperty');
const ContactEnquiry = require('./ContactEnquiry');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    // Create default admin if none exists
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      await User.create({
        name: 'Admin',
        email: 'admin@luckys-home.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Default admin created: admin@luckys-home.com / Admin@123');
    }
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, User, BuyProperty, RentProperty, ContactEnquiry, syncDatabase };
