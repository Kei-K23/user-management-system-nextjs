import { generateRandomNumber } from "@/lib/utils";
import { sendEmail } from "@/services/mail/mail-backend";
import ResetPasswordEmail from "@/services/mail/reset-password-email";
import { selectUserById } from "@/services/user";
import { insertVerificationToken } from "@/services/verification-token";
import { EmailCategory } from "@/types";
import { render } from "@react-email/components";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const userId = jsonData.userId;
    const email = jsonData.email;

    // TODO: handle user existing
    const user = await selectUserById(userId);

    if (!user.length) {
        return Response.json({ error: 'Invalid user' }, { status: 401 });
    }

    if (user[0].email !== email) {
        return Response.json({ error: 'Invalid email' }, { status: 401 });
    }

    // Generate a random verification token
    const verificationToken = generateRandomNumber();

    // Create a new user account verification token
    await insertVerificationToken({
        userId: user[0].id,
        token: verificationToken,
        category: EmailCategory.PASSWORD_RESET
    });

    // Render email template
    const emailHtml = render(ResetPasswordEmail({ verificationCode: verificationToken }));

    // Send email
    sendEmail({
        emailHtml,
        subject: "Password Reset",
        to: user[0].email
    });

    return Response.json({ message: "Successfully resend the password reset code" }, { status: 200 });
}