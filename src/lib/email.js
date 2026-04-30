import emailjs from '@emailjs/browser';

// EmailJS Configuration — fill in to enable real email delivery.
// 1. Sign up at https://emailjs.com
// 2. Add a Gmail service → copy Service ID
// 3. Create a template with variables: {{to_name}}, {{to_email}},
//    {{subject}}, {{zodiac}}, {{sent_date}}, {{content}}
// 4. Account → API Keys → copy Public Key
export const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
export const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
export const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
export const EMAILJS_READY = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

const LOG_KEY = 'hora_email_log';

export function recordSent(type, email) {
  const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  log.push({ type, email, date: new Date().toISOString() });
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export function getLastSent(type) {
  const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  return log.filter(e => e.type === type).slice(-1)[0] || null;
}

export function getSavedEmail() {
  return sessionStorage.getItem('hora_email') || '';
}

export function saveEmail(email) {
  sessionStorage.setItem('hora_email', email);
}

export async function sendEmail({ toName, toEmail, subject, zodiac, sentDate, content }) {
  if (!EMAILJS_READY) {
    const body = content.substring(0, 1800);
    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { mode: 'mailto' };
  }
  emailjs.init(EMAILJS_PUBLIC_KEY);
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_name: toName || 'there',
    to_email: toEmail,
    subject,
    zodiac,
    sent_date: sentDate,
    content,
  });
  return { mode: 'emailjs' };
}
