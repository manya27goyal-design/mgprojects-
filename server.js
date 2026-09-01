// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve static files (HTML, CSS, JS) from the project root
app.use(express.static(__dirname));

app.post('/api/inquiry', async (req, res) => {
  const { fullName, companyName, email, phone, interest, message } = req.body;
  console.log('Incoming inquiry:', req.body);
  // Basic validation
  if (!fullName || !companyName || !email || !phone || !interest || !message) {
    return res.json({ success: false, error: 'Missing required fields' });
  }
  // Configure nodemailer transporter
  let transporter;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Fallback to a test Ethereal account for development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  const mailOptions = {
    from: '"V Mighty Agro" <no-reply@vmightyagro.com>',
    to: 'vmightyagro@gmail.com',
    subject: `New inquiry from ${fullName}`,
    text: `Company: ${companyName}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\nMessage: ${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview URL for Ethereal
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
