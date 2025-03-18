import { Card } from "@heroui/react";
import { type Metadata } from "next";

import ContactForm from "./_components/contact-form";

import Title from "@/components/common/title";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <Title title="Contact Us" />
        <ContactForm />
      </Card>
    </div>
  );
}
