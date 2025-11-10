const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendTicketEmail = async (userEmail, userName, ticketData) => {
  const { ticketId, busNumber, routeNumber, routeName, fromStop, toStop, fare, qrCode, validUntil } = ticketData;

  // Extract base64 data from QR code
  const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');

  const mailOptions = {
    from: `CitiConnect <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Your Bus Ticket - ${ticketId}`,
    attachments: [
      {
        filename: `ticket-${ticketId}.png`,
        content: base64Data,
        encoding: 'base64',
        cid: 'qrcode@citiconnect'
      }
    ],
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { max-width: 250px; border: 2px solid #667eea; border-radius: 8px; padding: 10px; background: white; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #667eea; }
          .value { color: #333; }
          .fare { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚌 CitiConnect Bus Ticket</h1>
            <p>Your journey starts here!</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Your bus ticket has been generated successfully. Please show this QR code to the driver when boarding.</p>
            
            <div class="ticket-box">
              <div class="detail-row">
                <span class="label">Ticket ID:</span>
                <span class="value">${ticketId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Route:</span>
                <span class="value">${routeNumber} - ${routeName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Bus Number:</span>
                <span class="value">${busNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">From:</span>
                <span class="value">${fromStop}</span>
              </div>
              <div class="detail-row">
                <span class="label">To:</span>
                <span class="value">${toStop}</span>
              </div>
              <div class="detail-row">
                <span class="label">Valid Until:</span>
                <span class="value">${new Date(validUntil).toLocaleString()}</span>
              </div>
            </div>

            <div class="fare">
              Total Fare: ₹${fare}
            </div>

            <div class="qr-code">
              <h3>Your QR Code Ticket</h3>
              <img src="cid:qrcode@citiconnect" alt="QR Code" />
              <p style="color: #666; font-size: 14px;">Show this QR code to the driver</p>
              <p style="color: #667eea; font-size: 12px; margin-top: 10px;">📥 QR code is attached - Download it for offline use</p>
            </div>

            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This ticket is valid for 24 hours from generation</li>
                <li>Keep this email for your records</li>
                <li>The QR code can only be used once</li>
                <li>Present this ticket to the driver when boarding</li>
              </ul>
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <strong>Have a safe journey! 🚌</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email from CitiConnect. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} CitiConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Ticket email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendTicketEmail };
