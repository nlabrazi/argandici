// server/utils/mailService.ts
import Mailgun from "mailgun.js";
import formData from "form-data";

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const fromEmail = process.env.MAILGUN_FROM ?? `postmaster@${domain}`;
const contactRecipient = process.env.CONTACT_RECIPIENT ?? 'contact@argandici.com';

if (!apiKey || !domain) throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN missing in env');

const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({
  username: "api",
  key: apiKey,
  url: "https://api.eu.mailgun.net",
});
const realDomain = domain as string;

// ✅ Envoi email facture (PDF attaché, ou lien)
export async function sendInvoiceEmail({
  to,
  orderId,
  pdfBuffer,
  pdfUrl,
}: {
  to: string;
  orderId: string;
  pdfBuffer?: Buffer;
  pdfUrl?: string;
}) {
  const html = `
    <p>Merci pour votre commande !</p>
    <p>Votre facture est disponible ci-dessous.</p>
    ${pdfUrl
      ? `<p><a href="${pdfUrl}" target="_blank">Télécharger la facture</a></p>`
      : ""
    }
  `;
  const msg: any = {
    from: `Argan d'ici <${fromEmail}>`,
    to: [to],
    subject: `Votre facture - Commande ${orderId}`,
    html,
  }
  if (pdfBuffer) {
    msg.attachment = [
      {
        filename: `facture-${orderId}.pdf`,
        data: pdfBuffer,
      },
    ];
  }
  await mgClient.messages.create(realDomain, msg)
  console.log(`📧 Facture envoyée à ${to}`);
}

// ✅ Envoi de notification de contact
export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = `
    <h2>Nouveau message de contact</h2>
    <p><strong>De:</strong> ${name} (${email})</p>
    <p><strong>Sujet:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p>${message}</p>
    <p><em>Message reçu le ${new Date().toLocaleString('fr-FR')}</em></p>
  `;

  await mgClient.messages.create(realDomain, {
    from: `Site Web Argan d'ici <${fromEmail}>`,
    to: [contactRecipient],
    subject: `[CONTACT] ${subject}`,
    html,
  });
  console.log(`📧 Notification de contact envoyée à ${contactRecipient}`);
}

// ✅ Confirmation de contact à l'utilisateur
export async function sendContactConfirmation({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = `
    <h2>Confirmation de réception de votre message</h2>
    <p>Bonjour ${name},</p>
    <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>

    <h3>Récapitulatif de votre message :</h3>
    <p><strong>Sujet :</strong> ${subject}</p>
    <p><strong>Message :</strong></p>
    <blockquote>${message}</blockquote>

    <p>Notre équipe traitera votre demande dans les plus brefs délais et vous répondra très rapidement.</p>

    <p>Cordialement,</p>
    <p><strong>L'équipe Argan d'ici</strong></p>
    <p><em>"Pur comme là-bas, authentique comme ici"</em></p>
  `;

  await mgClient.messages.create(realDomain, {
    from: `Argan d'ici <${fromEmail}>`,
    to: [email],
    subject: `Confirmation de réception : ${subject}`,
    html,
  });
  console.log(`📧 Confirmation de contact envoyée à ${email}`);
}
