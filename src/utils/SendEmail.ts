import nodemailer from "nodemailer";
import { config } from "../config";

if (!config.user_email || !config.user_password) {
    throw new Error("Email credentials not configured properly");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.node_env === "production" ? 465 : 587,
    secure: config.node_env === "production",
    auth: {
        user: config.user_email,
        pass: config.user_password,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: config.user_email,
        to,
        subject,
        text: html.replace(/<[^>]*>?/gm, ""),
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
