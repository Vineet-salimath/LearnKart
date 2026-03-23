import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test connection (non-blocking)
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email service unavailable:', error.message);
    console.warn('💡 Tip: Check Gmail credentials or unlock account at https://myaccount.google.com/security');
  } else {
    console.log('✅ Email service ready');
  }
});

export default transporter;

// Email templates

export const welcomeEmailTemplate = (name) => ({
  subject: 'Welcome to LMS Platform!',
  html: `
    <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #5B4EE8;">Welcome to LMS, ${name}!</h1>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>You can now explore thousands of courses and start learning today.</p>
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #5B4EE8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Start Learning</a>
      <p style="margin-top: 40px; color: #6B7280; font-size: 12px;">Best regards, LMS Team</p>
    </div>
  `
});

export const enrollmentConfirmationTemplate = (studentName, courseName, instructorName) => ({
  subject: `You're enrolled in ${courseName}!`,
  html: `
    <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #5B4EE8;">Enrollment Confirmed!</h1>
      <p>Hi ${studentName},</p>
      <p>Great news! You've successfully enrolled in <strong>${courseName}</strong> by ${instructorName}.</p>
      <p>You can now access all the course materials and start learning.</p>
      <a href="${process.env.FRONTEND_URL}/learn" style="display: inline-block; background: #00C48C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Go to Course</a>
      <p style="margin-top: 40px; color: #6B7280; font-size: 12px;">Best regards, LMS Team</p>
    </div>
  `
});

export const orderReceiptTemplate = (studentName, orderID, coursesList, amount) => ({
  subject: `Order Receipt - ${orderID}`,
  html: `
    <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #5B4EE8;">Order Confirmation</h1>
      <p>Hi ${studentName},</p>
      <p>Thank you for your purchase! Your payment has been successfully processed.</p>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${orderID}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <h3>Courses</h3>
      <ul>
        ${coursesList.map(course => `<li>${course}</li>`).join('')}
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #5B4EE8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">View My Courses</a>
      <p style="margin-top: 40px; color: #6B7280; font-size: 12px;">Best regards, LMS Team</p>
    </div>
  `
});
