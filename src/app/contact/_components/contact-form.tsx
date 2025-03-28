"use client";

import { Input, Textarea, Button, Form } from "@heroui/react";
import { type FormEvent, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form submission logic, e.g., sending data to an API
  };
  return (
    <Form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Input
        fullWidth
        size="lg"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Input
        fullWidth
        size="lg"
        placeholder="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Input
        fullWidth
        size="lg"
        placeholder="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        className="w-full"
      />
      <Textarea
        fullWidth
        size="lg"
        placeholder="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Button
        aria-label="Submit"
        type="submit"
        color="primary"
        size="lg"
        className="w-full"
      >
        Send Message
      </Button>
    </Form>
  );
}
