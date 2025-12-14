const nodemailer = require("nodemailer");

// Email configuration
const EMAIL_CONFIG = {
  // For development, we'll use a test account or Gmail SMTP
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Email templates
const templates = {
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmation - ${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .order-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .product-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
            .product-item:last-child { border-bottom: none; }
            .total { font-size: 18px; font-weight: bold; color: #ff6b9d; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%); color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order, ${user.username}!</p>
            </div>
            
            <div class="content">
              <p>We're excited to let you know that your order has been confirmed and is being prepared with love!</p>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                
                <h4>Items Ordered:</h4>
                ${order.items
                  .map(
                    item => `
                  <div class="product-item">
                    <div>
                      <strong>${item.product.name}</strong>
                      <br>
                      <small>Quantity: ${item.quantity}</small>
                    </div>
                    <div>
                      ₹${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                `
                  )
                  .join("")}
                
                <div class="product-item" style="border-top: 2px solid #ff6b9d; margin-top: 10px; padding-top: 10px;">
                  <strong>Total Amount:</strong>
                  <div class="total">₹${order.total.toLocaleString()}</div>
                </div>
              </div>
              
              <p>We'll send you another email when your order is shipped. In the meantime, you can track your order status in your account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/orders/${
      order._id
    }" class="btn">Track Your Order</a>
              </div>
              
              <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
            </div>
            
            <div class="footer">
              <p>💖 Love from the Ruha Team</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Order Confirmation - ${order._id}
      
      Hi ${user.username}!
      
      Your order has been confirmed and is being prepared with love!
      
      Order Details:
      - Order ID: ${order._id}
      - Order Date: ${new Date(order.createdAt).toLocaleDateString()}
      - Status: Confirmed
      - Payment Method: ${order.paymentMethod}
      
      Items:
      ${order.items
        .map(
          item =>
            `- ${item.product.name} (Qty: ${item.quantity}) - ₹${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join("\n")}
      
      Total: ₹${order.total.toLocaleString()}
      
      Track your order: ${process.env.FRONTEND_URL}/orders/${order._id}
      
      Love from the Ruha Team!
    `,
  }),

  orderShipped: (order, user) => ({
    subject: `Your Order is on the Way! - ${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Shipped</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .shipping-info { background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Your Order is Shipped!</h1>
              <p>Great news, ${user.username}! Your order is on its way.</p>
            </div>
            
            <div class="content">
              <p>Your order has been shipped and should arrive soon. We're so excited for you to receive your kawaii goodies!</p>
              
              <div class="shipping-info">
                <h3>🚚 Shipping Details</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Tracking Number:</strong> ${
                  order.trackingNumber || "Will be provided soon"
                }</p>
                <p><strong>Estimated Delivery:</strong> ${
                  order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString()
                    : "3-5 business days"
                }</p>
                <p><strong>Shipping Address:</strong></p>
                <p>
                  ${order.shippingAddress?.street || ""}<br>
                  ${order.shippingAddress?.city || ""}, ${
      order.shippingAddress?.state || ""
    } ${order.shippingAddress?.zipCode || ""}<br>
                  ${order.shippingAddress?.country || ""}
                </p>
              </div>
              
              <p>You can track your package using the tracking number provided above, or track it directly through our website.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/orders/${
      order._id
    }" class="btn">Track Package</a>
              </div>
              
              <p>We hope you love your new kawaii items! Don't forget to leave us a review once you receive them.</p>
            </div>
            
            <div class="footer">
              <p>💖 Love from the Ruha Team</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Your Order is Shipped! - ${order._id}
      
      Hi ${user.username}!
      
      Great news! Your order has been shipped and is on its way.
      
      Shipping Details:
      - Order ID: ${order._id}
      - Tracking Number: ${order.trackingNumber || "Will be provided soon"}
      - Estimated Delivery: ${
        order.estimatedDelivery
          ? new Date(order.estimatedDelivery).toLocaleDateString()
          : "3-5 business days"
      }
      
      Track your package: ${process.env.FRONTEND_URL}/orders/${order._id}
      
      Love from the Ruha Team!
    `,
  }),

  orderDelivered: (order, user) => ({
    subject: `Order Delivered! How was your experience? - ${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Delivered</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .review-section { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; text-decoration: none; border-radius: 6px; margin: 10px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Delivered Successfully!</h1>
              <p>Hope you love your kawaii items, ${user.username}!</p>
            </div>
            
            <div class="content">
              <p>Your order has been delivered! We hope you're enjoying your new kawaii goodies.</p>
              
              <div class="review-section">
                <h3>⭐ We'd love your feedback!</h3>
                <p>Your opinion matters to us. Please take a moment to review the products you received and let other customers know what you think.</p>
                
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Review Your Order</a>
                </div>
              </div>
              
              <p>If you have any issues with your order or need support, please don't hesitate to contact us.</p>
              
              <p>Thank you for choosing Ruha for your kawaii needs! 💖</p>
            </div>
            
            <div class="footer">
              <p>💖 Love from the Ruha Team</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Order Delivered! - ${order._id}
      
      Hi ${user.username}!
      
      Your order has been delivered successfully!
      
      We hope you're enjoying your kawaii items. Please take a moment to review your order and share your feedback.
      
      Review your order: ${process.env.FRONTEND_URL}/orders/${order._id}
      
      Thank you for choosing Ruha!
      
      Love from the Ruha Team!
    `,
  }),
};

// Email sending functions
const sendOrderConfirmation = async (order, user) => {
  try {
    const template = templates.orderConfirmation(order, user);

    const mailOptions = {
      from: `"Ruha Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

const sendOrderShipped = async (order, user) => {
  try {
    const template = templates.orderShipped(order, user);

    const mailOptions = {
      from: `"Ruha Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order shipped email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending order shipped email:", error);
    throw error;
  }
};

const sendOrderDelivered = async (order, user) => {
  try {
    const template = templates.orderDelivered(order, user);

    const mailOptions = {
      from: `"Ruha Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order delivered email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending order delivered email:", error);
    throw error;
  }
};

// Generic email function for custom emails
const sendEmail = async (to, subject, html, text = "") => {
  try {
    const mailOptions = {
      from: `"Ruha Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Verify transporter configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email service is ready!");
  } catch (error) {
    console.error("Email service configuration error:", error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderShipped,
  sendOrderDelivered,
  sendEmail,
  verifyConnection,
  transporter,
};
