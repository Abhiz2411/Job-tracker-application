import emailjs from '@emailjs/browser';

interface NotificationParams {
  to_email: string;
  to_name: string;
  company: string;
  position: string;
  interview_date: string;
  interview_time?: string;
}

export const sendInterviewReminder = async (params: NotificationParams) => {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      params,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};