import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3367c1e6150cac",
    pass: "3547bd7f3fd129"
  }
});

export const sendEmail = async ({ emailHtml, subject, to }: { emailHtml: string, subject: string, to: string }) => {

  const options = {
    from: "arkarmin@dev.com",
    to,
    subject,
    html: emailHtml,
  };

  await transport.sendMail(options);
}



