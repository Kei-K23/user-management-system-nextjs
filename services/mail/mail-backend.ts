import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
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



