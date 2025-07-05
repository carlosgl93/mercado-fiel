import * as nodemailer from 'nodemailer';
/**;
 * sendEmailSettings - Function to set the email settings require to send emails
 * @returns  the firebase bucket and the mailTransport
 */

export function sendEmailSettings() {
  const email = process.env.EMAIL_USERNAME;
  const password = process.env.EMAIL_PASSWORD;
  const mailTransport = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });

  return { mailTransport };
}
