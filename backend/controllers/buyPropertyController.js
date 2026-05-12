const { Op } = require('sequelize');
const { BuyProperty } = require('../models');
const { deleteFile } = require('../config/multer');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, location, propertyType, minPrice, maxPrice, featured, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (location) where.location = { [Op.like]: `%${location}%` };
    if (propertyType) where.propertyType = propertyType;
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BuyProperty.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const property = await BuyProperty.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, location, address, propertyType, bedrooms, bathrooms, area, featured, status, amenities } = req.body;
    const images = req.body.images ? JSON.parse(req.body.images) : [];
    const documents = req.body.documents ? JSON.parse(req.body.documents) : [];

    const property = await BuyProperty.create({
      title, description, price, location, address, propertyType,
      bedrooms: bedrooms || 0, bathrooms: bathrooms || 0, area,
      featured: featured === 'true' || featured === true,
      status: status || 'available',
      images, documents,
      amenities: amenities ? JSON.parse(amenities) : [],
    });

    res.status(201).json({ success: true, message: 'Property created', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const property = await BuyProperty.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const updates = { ...req.body };
    if (updates.images && typeof updates.images === 'string') updates.images = JSON.parse(updates.images);
    if (updates.documents && typeof updates.documents === 'string') updates.documents = JSON.parse(updates.documents);
    if (updates.amenities && typeof updates.amenities === 'string') updates.amenities = JSON.parse(updates.amenities);
    if (updates.featured !== undefined) updates.featured = updates.featured === 'true' || updates.featured === true;

    await property.update(updates);
    res.json({ success: true, message: 'Property updated', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const property = await BuyProperty.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    // Delete files non-blocking — do not await, do not throw on failure
    const images = Array.isArray(property.images) ? property.images : [];
    const documents = Array.isArray(property.documents) ? property.documents : [];
    [...images, ...documents].forEach((filePath) => {
      try { deleteFile(filePath); } catch { /* ignore file deletion errors */ }
    });

    await property.destroy();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
