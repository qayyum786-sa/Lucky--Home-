const { ContactEnquiry } = require('../models');
const { sendContactEmail } = require('../config/email');

exports.submit = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const enquiry = await ContactEnquiry.create({ name, email, phone, message });

    // Send emails (non-blocking)
    let emailSent = false;
    try {
      await sendContactEmail({ name, email, phone, message });
      emailSent = true;
      await enquiry.update({ emailSent: true });
    } catch (emailError) {
      console.error('Email send failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will get back to you soon!',
      data: { id: enquiry.id, emailSent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await ContactEnquiry.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    if (enquiry.status === 'new') await enquiry.update({ status: 'read' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    await enquiry.update({ status: req.body.status });
    res.json({ success: true, message: 'Status updated', data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
