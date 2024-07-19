import nodemailer from 'nodemailer';

// Define the environment variables interface for better type checking
interface EnvironmentVariables {
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

// Load environment variables and assert their existence
const environment: EnvironmentVariables = {
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: Number(process.env.EMAIL_PORT),
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
};

const transporter = nodemailer.createTransport({
  host: environment.EMAIL_HOST,
  port: environment.EMAIL_PORT,
  auth: {
    user: environment.EMAIL_USER,
    pass: environment.EMAIL_PASS,
  },
});

// Define the sendEmail function with proper types
export const sendEmail = async (
  to: string,
  subject: string,
  text?: string,
  html?: string,
  attachments?: { filename: string; content: any }[]
): Promise<void> => {
  const mailOptions = {
    from: environment.EMAIL_USER,
    to,
    subject,
    text,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};