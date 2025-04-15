import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
    <p>Dear LavSense Team,</p>

    <p>
      You have received a new message via the contact form. Here are the
      details:
    </p>

    <ul>
      <li>
        <strong>Name:</strong> {name}
      </li>
      <li>
        <strong>Email:</strong> {email}
      </li>
      <li>
        <strong>Subject:</strong> {subject}
      </li>
    </ul>

    <p>
      <strong>Message:</strong>
    </p>
    <p style={{ whiteSpace: "pre-line" }}>{message}</p>

    <p>
      Regards,
      <br />
      {name}
    </p>
  </div>
);
