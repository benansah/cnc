import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// Email templates
export function getBookingConfirmationEmail(
  passengerName: string,
  from: string,
  to: string,
  departureDate: string,
  departureTime: string,
  seats: string[],
  totalPrice: number,
  ticketNumber: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .ticket-info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          .price-box { font-size: 24px; font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Booking Confirmation</h1>
          </div>
          
          <p>Hello ${passengerName},</p>
          
          <p>Your bus booking has been confirmed. Here are your details:</p>
          
          <div class="ticket-info">
            <p><strong>Route:</strong> ${from} → ${to}</p>
            <p><strong>Date:</strong> ${departureDate}</p>
            <p><strong>Time:</strong> ${departureTime}</p>
            <p><strong>Seats:</strong> ${seats.join(", ")}</p>
            <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
          </div>
          
          <div class="ticket-info">
            <p>Total Amount Paid:</p>
            <p class="price-box">GH₵${totalPrice.toLocaleString("en-GH")}</p>
          </div>
          
          <p><strong>Instructions:</strong></p>
          <ul>
            <li>Please arrive 30 minutes before departure</li>
            <li>Keep your ticket number for check-in</li>
            <li>Check-in opens 1 hour before departure</li>
          </ul>
          
          <div class="footer">
            <p>Thank you for booking with C&C Transport</p>
            <p>If you have any questions, contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPaymentReceiptEmail(
  passengerName: string,
  reference: string,
  amount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #52c41a 0%, #45a049 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .receipt-info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #52c41a; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Payment Successful</h1>
          </div>
          
          <p>Hello ${passengerName},</p>
          
          <p>Your payment has been processed successfully.</p>
          
          <div class="receipt-info">
            <p><strong>Transaction Reference:</strong> ${reference}</p>
            <p><strong>Amount Paid:</strong> GH₵${amount.toLocaleString("en-GH")}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Your booking is now confirmed. You will receive a separate email with your ticket details.</p>
          
          <div class="footer">
            <p>Thank you for your payment</p>
            <p>C&C Transport Team</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
