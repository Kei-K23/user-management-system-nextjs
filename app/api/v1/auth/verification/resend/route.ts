import { generateRandomNumber } from "@/lib/utils";
import { sendEmail } from "@/services/mail/mail-backend";
import VerificationTokenEmail from "@/services/mail/verification-email";
import { selectUserById } from "@/services/user";
import { insertVerificationToken } from "@/services/verification-token";
import { EmailCategory } from "@/types";
import { render } from "@react-email/components";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const userId = jsonData.userId;

    // TODO: handle user existing
    const user = await selectUserById(userId);

    if (!user.length) {
        return Response.json({ error: 'Invalid user' }, { status: 401 });
    }

    // Generate a random verification token
    const verificationToken = generateRandomNumber();

    // Create a new user account verification token
    await insertVerificationToken({
        userId: user[0].id,
        token: verificationToken,
        category: EmailCategory.EMAIL_VERIFICATION
    });

    // Render email template
    const emailHtml = render(VerificationTokenEmail({ verificationCode: verificationToken }));

    // Send email
    sendEmail({
        emailHtml,
        subject: "Account Verification",
        to: user[0].email
    });

    return Response.json({ message: "Successfully resend the verification code" }, { status: 200 });
}