const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BuyProperty = sequelize.define('BuyProperty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false, validate: { notEmpty: true } },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, validate: { min: 0 } },
  location: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.TEXT },
  propertyType: {
    type: DataTypes.ENUM('apartment', 'house', 'villa', 'plot', 'commercial', 'penthouse', 'co-op', 'loft', 'townhouse'),
    allowNull: false,
    defaultValue: 'house',
  },
  bedrooms: { type: DataTypes.INTEGER, defaultValue: 0 },
  bathrooms: { type: DataTypes.INTEGER, defaultValue: 0 },
  area: { type: DataTypes.DECIMAL(10, 2) }, // in sq ft
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'pending'),
    defaultValue: 'available',
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const val = this.getDataValue('images');
      if (!val) return [];
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return []; }
      }
      return val;
    },
  },
  documents: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const val = this.getDataValue('documents');
      if (!val) return [];
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return []; }
      }
      return val;
    },
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const val = this.getDataValue('amenities');
      if (!val) return [];
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return []; }
      }
      return val;
    },
  },
}, {
  tableName: 'buy_properties',
  timestamps: true,
});

module.exports = BuyProperty;
