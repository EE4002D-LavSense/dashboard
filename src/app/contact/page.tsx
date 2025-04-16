import { type Metadata } from "next";

import ContactForm from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="flex justify-center p-8">
      <ContactForm />
    </div>
  );
}
