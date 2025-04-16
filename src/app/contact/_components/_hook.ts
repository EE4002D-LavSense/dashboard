"use client";

import emailjs from "@emailjs/browser";

emailjs.init({
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  // Do not allow headless browsers
  limitRate: {
    // Set the limit rate for the application
    id: "app",
    // Allow 1 request per 10s
    throttle: 10000,
  },
});

export async function sendContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  return emailjs.send("service_01mqggu", "template_ysp1ki7", {
    subject: subject,
    name: name,
    message: message,
    sender_email: email,
  });
}
