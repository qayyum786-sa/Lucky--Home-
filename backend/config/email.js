const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async ({ name, email, phone, message }) => {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Email to admin
  const adminMailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Enquiry from ${name} - Lucky's Home Improvement`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #111111; color: #f5f5f5; padding: 0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #111111 0%, #252525 100%); padding: 30px; border-bottom: 3px solid #F2B12D;">
          <h1 style="color: #F2B12D; margin: 0; font-size: 28px; letter-spacing: 2px;">LUCKY'S</h1>
          <p style="color: #999; margin: 5px 0 0 0; font-size: 13px; letter-spacing: 1px;">HOME IMPROVEMENT SERVICES</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #F2B12D; margin-top: 0;">New Enquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #999; width: 30%;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #f5f5f5;">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #999;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #f5f5f5;"><a href="mailto:${email}" style="color: #F2B12D;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #999;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #f5f5f5;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #999;">Received</td><td style="padding: 10px 0; border-bottom: 1px solid #333; color: #f5f5f5;">${timestamp}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 20px; background: #252525; border-radius: 4px; border-left: 3px solid #F2B12D;">
            <p style="color: #999; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="color: #f5f5f5; margin: 0; line-height: 1.6;">${message}</p>
          </div>
        </div>
        <div style="padding: 20px 30px; background: #111; text-align: center; color: #555; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Lucky's Home Improvement Services. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Confirmation email to user
  const userMailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `We received your enquiry - Lucky's Home Improvement`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #111111; color: #f5f5f5; padding: 0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #111111 0%, #252525 100%); padding: 30px; border-bottom: 3px solid #F2B12D;">
          <h1 style="color: #F2B12D; margin: 0; font-size: 28px; letter-spacing: 2px;">LUCKY'S</h1>
          <p style="color: #999; margin: 5px 0 0 0; font-size: 13px; letter-spacing: 1px;">HOME IMPROVEMENT SERVICES</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #F2B12D; margin-top: 0;">Thank You, ${name}!</h2>
          <p style="color: #ccc; line-height: 1.8;">We have received your enquiry and our team will get back to you within 24 hours.</p>
          <div style="margin: 25px 0; padding: 20px; background: #252525; border-radius: 4px; border-left: 3px solid #F2B12D;">
            <p style="color: #999; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
            <p style="color: #f5f5f5; margin: 0; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #999; font-size: 13px; line-height: 1.8;">If you have any urgent queries, please contact us directly at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #F2B12D;">${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}</a></p>
        </div>
        <div style="padding: 20px 30px; background: #111; text-align: center; color: #555; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Lucky's Home Improvement Services. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const adminResult = await transporter.sendMail(adminMailOptions);
  const userResult = await transporter.sendMail(userMailOptions);

  console.log('Admin notification sent:', adminResult.messageId);
  console.log('User confirmation sent:', userResult.messageId);

  return { adminResult, userResult };
};

module.exports = { transporter, sendContactEmail };
