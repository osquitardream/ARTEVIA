import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'arteviainmobiliaria@gmail.com';

interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export async function sendContactNotificationEmail(data: ContactEmailPayload): Promise<void> {
  const { name, email, phone, subject, message } = data;

  const emailSubject = `Nuevo Lead Inmobiliario: ${name} — ${subject || 'Consulta General'}`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e0d5; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #c89b5c;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 0.15em; font-family: Georgia, serif;">ARTEVÍA</h1>
        <p style="color: #c89b5c; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.25em;">Inmobiliaria</p>
      </div>

      <div style="padding: 30px 24px;">
        <h2 style="color: #1a1410; font-size: 18px; margin: 0 0 16px 0; font-family: Georgia, serif;">
          Nuevo Mensaje de Contacto Recibido
        </h2>
        <p style="color: #6b5f52; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
          Un cliente potencial ha enviado una solicitud a través de la página web de ARTEVÍA.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #f0ebe4;">
            <td style="padding: 10px 0; color: #9b8b7a; font-size: 12px; text-transform: uppercase; font-weight: bold; width: 140px;">Cliente:</td>
            <td style="padding: 10px 0; color: #1a1410; font-size: 14px; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0ebe4;">
            <td style="padding: 10px 0; color: #9b8b7a; font-size: 12px; text-transform: uppercase; font-weight: bold;">Correo:</td>
            <td style="padding: 10px 0; color: #1a1410; font-size: 14px;">
              <a href="mailto:${email}" style="color: #c89b5c; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f0ebe4;">
            <td style="padding: 10px 0; color: #9b8b7a; font-size: 12px; text-transform: uppercase; font-weight: bold;">Teléfono / WhatsApp:</td>
            <td style="padding: 10px 0; color: #1a1410; font-size: 14px;">
              ${phone ? `<a href="https://wa.me/51${phone.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${phone} (Abrir WhatsApp)</a>` : 'No proporcionado'}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f0ebe4;">
            <td style="padding: 10px 0; color: #9b8b7a; font-size: 12px; text-transform: uppercase; font-weight: bold;">Asunto:</td>
            <td style="padding: 10px 0; color: #1a1410; font-size: 14px; font-weight: 600;">${subject || 'Consulta General'}</td>
          </tr>
        </table>

        <div style="background: #faf7f3; border: 1px solid #e8e0d5; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
          <p style="color: #9b8b7a; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0; letter-spacing: 0.05em;">
            Mensaje del Cliente:
          </p>
          <p style="color: #1a1410; font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">
            ${message}
          </p>
        </div>

        ${phone ? `
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://wa.me/51${phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(name)},%20te%20contacto%20de%20ARTEV%C3%8DA%20Inmobiliaria%20sobre%20tu%20consulta." 
               style="background: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Responder por WhatsApp
            </a>
          </div>
        ` : ''}
      </div>

      <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          ARTEVÍA Inmobiliaria &bull; Notificación Automática &bull; Enviado a ${ADMIN_EMAIL}
        </p>
      </div>
    </div>
  `;

  // Check if SMTP credentials are configured
  const smtpUser = process.env.SMTP_USER || process.env.ADMIN_EMAIL || 'olimaym18@gmail.com';
  const smtpPass = process.env.SMTP_PASS;

  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ''), // remove any accidental spaces in app password
        },
      });

      const info = await transporter.sendMail({
        from: `"ARTEVÍA Inmobiliaria" <${smtpUser}>`,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: emailSubject,
        html: htmlContent,
      });

      console.log(`✅ [ÉXITO] Correo de contacto enviado a ${ADMIN_EMAIL} (Message ID: ${info.messageId})`);
    } catch (err: any) {
      console.error('❌ [ERROR SMTP al enviar correo a Gmail]:', err.message || err);
      console.log(`\n========================================`);
      console.log(`📬 NOTIFICACIÓN DE LEAD (Guardada en Base de Datos):`);
      console.log(`Destinatario: ${ADMIN_EMAIL}`);
      console.log(`Cliente: ${name} <${email}> | Tel: ${phone || 'N/A'}`);
      console.log(`Asunto: ${emailSubject}`);
      console.log(`Mensaje: ${message}`);
      console.log(`========================================\n`);
    }
  } else {
    // If SMTP_PASS not set in .env
    console.log(`\n========================================`);
    console.log(`📬 NUEVO LEAD DE CONTACTO REGISTRADO EN BD:`);
    console.log(`Destinatario configurado: ${ADMIN_EMAIL}`);
    console.log(`Cliente: ${name} <${email}> | Tel: ${phone || 'N/A'}`);
    console.log(`Asunto: ${emailSubject}`);
    console.log(`Mensaje: ${message}`);
    console.log(`⚠️ Para que el correo llegue físicamente a tu Gmail inbox (${ADMIN_EMAIL}), debes colocar tu contraseña de aplicación de 16 dígitos en backend/.env (SMTP_PASS="xxxx xxxx xxxx xxxx")`);
    console.log(`========================================\n`);
  }
}
