// app/api/send-verification-email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { email, code } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER!,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  const mailOptions = {
    from: `"No Reply" <${process.env.SMTP_USERNAME}>`,
    to: email,
    subject: "Tu código de verificación",
    html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "No se pudo enviar el correo" }, { status: 500 });
  }
}
