const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactEnquiry = sequelize.define('ContactEnquiry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(20) },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('new', 'read', 'responded'),
    defaultValue: 'new',
  },
  emailSent: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'contact_enquiries',
  timestamps: true,
});

module.exports = ContactEnquiry;
