import { sendEmail } from "@/lib/EmailsService";

// ------------------------- Insight Post Emails
export async function ApprovePostEmail({ email, name, heading, public_url }) {
    await sendEmail({
        type: "insight-post",
        to: email,
        subject: "Your Insight Has Been Approved and Published",
        html: `
            <p><b>Hi ${name},</b></p>
            <p>Good news! Your insight <b>${heading}</b> has been approved and is now live on The Procurement Plug.</p>
            <p>You can view it here: <b>${public_url}</b></p>
            <p>Thanks for contributing valuable thought leadership to our community!</p>
            <p>Best regards,<br/>The Procurement Plug Team</p>
        `,
    });
}

export async function RejectPostEmail({ email, name, heading }) {
    await sendEmail({
        type: "insight-post",
        to: email,
        subject: "Update on Your Insight Submission",
        html: `
            <p><b>Hi ${name},</b></p>
            <p>Thank you for submitting your insight <b>${heading}</b>.</p>
            <p>After review, we’re unable to approve it for publication at this time.</p>
            <p>You may update and resubmit if you wish.</p>
            <p>Warm regards,<br/>The Procurement Plug Team</p>
        `,
    });
}