import { sendEmail } from "@/lib/EmailsService";

// ------------------------- Roundtable Emails
export async function ApproveRoundtableEmail({ email, name, title, package: roundtablePackage, date, secureLink }) {
    await sendEmail({
        type: "round-table",
        to: email,
        subject: "Great News! Your Roundtable is Live",
        html: `
            <p><b>Hi ${name},</b></p>
            <p>Great news—your Roundtable ${title} is now live on our forum for ${roundtablePackage} starting ${date}.</p>
            <ul style="list-style-type: disc; padding-left: 15px; margin: 0;">
                <li><b>Manage Invites & View Banner/Logo: </b> ${secureLink || "N/A"}</li>
            </ul>
            <p>Feel free to monitor RSVPs and post discussion prompts.</p>
            <p>Best regards,<br/>The Procurement Plug Team</p>
        `,
    });
}
export async function RejectRoundtableEmail({ email, name, title }) {
    await sendEmail({
        type: "round-table",
        to: email,
        subject: "Sorry! Roundtable Declined",
        html: `
            <p><b>Hi ${name},</b></p>
            <p>Thank you for your submission. After review, we’re not able to approve ${title} at this time.</p>
            <p>If you’d like to make edits or have questions, just reply to this email.</p>
            <p>Best regards,<br/>The Procurement Plug Team</p>
        `,
    });
}