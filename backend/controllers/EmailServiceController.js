import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // SMTP host (e.g., smtp.gmail.com, smtp.mail.yahoo.com)
    port: parseInt(process.env.EMAIL_PORT, 10), // SMTP port (e.g., 587 for TLS, 465 for SSL)
    secure: process.env.EMAIL_SECURE === "true", // Use TLS or SSL
    auth: {
        user: process.env.EMAIL_USER, // Email address
        pass: process.env.EMAIL_PASSWORD, // Email password or app-specific password
    },
});

export const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Your Business Name" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};
