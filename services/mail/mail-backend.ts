import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2d97929555ef4d",
    pass: "8560827b89ddad",
  },
});

export const sendEmail = async ({ emailHtml, subject, to }: { emailHtml: string, subject: string, to: string }) => {

  const options = {
    from: "arkarmin@dev.com",
    to,
    subject,
    html: emailHtml,
  };

  await transporter.sendMail(options);
}



