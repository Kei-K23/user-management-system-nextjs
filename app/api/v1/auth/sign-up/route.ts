import { generateRandomNumber } from "@/lib/utils";
import { sendEmail } from "@/services/mail/mail-backend";
import VerificationTokenEmail from "@/services/mail/verification-email";
import { insertUser } from "@/services/user";
import { insertVerificationToken } from "@/services/verification-token";
import { EmailCategory } from "@/types";
import { render } from "@react-email/components";
import * as argon2 from "argon2";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const username = jsonData.username;
    const email = jsonData.email;
    const phone = jsonData.phone;
    const password = jsonData.password;

    // Check validation for form data
    if (!username || !email || !phone || !password) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Hash the password
    const hashPassword = await argon2.hash(password.trim());
    // Insert user to your database here
    const newUser = await insertUser({
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: hashPassword,
    });

    // Generate a random verification token
    const verificationToken = generateRandomNumber();

    // Create a new user account verification token
    await insertVerificationToken({
        userId: newUser[0].id,
        token: verificationToken,
        category: EmailCategory.EMAIL_VERIFICATION
    });

    // Render email template
    const emailHtml = render(VerificationTokenEmail({ verificationCode: verificationToken }));

    // Send email
    sendEmail({
        emailHtml,
        subject: "Account Verification",
        to: email
    });

    return Response.json({ data: newUser }, { status: 201 });
}