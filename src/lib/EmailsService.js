import nodemailer from "nodemailer";

/**
 * Reusable function to send emails with different Outlook accounts.
 *
 * @param {Object} options
 * @param {"concierge"|"becomeQaPartner"|"becomeExpert"|"registerInterest"} options.type - Which account to use
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 */


export async function sendEmail({ type, to, subject, html }) {
    // Map account type → env vars
    const accounts = {
        "round-table": {
            user: process.env.SMTP_ROUNDTABLE_USER,
            pass: process.env.SMTP_ROUNDTABLE_PASS,
            label: "VIP Business Lounge",
        },
        "insightPost": {
            user: process.env.SMTP_ROUNDTABLE_USER,
            pass: process.env.SMTP_ROUNDTABLE_USER,
            label: "Insight Posts - The Procurement Plug",
        },
        // Add more accounts as needed
    };

    const account = accounts[type];
    if (!account) {
        throw new Error(`Invalid email type: ${type}`);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });

    await transporter.sendMail({
        from: `"${account.label}" <${account.user}>`,
        to,
        subject,
        html,
    });
}
