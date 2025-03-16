"use client";

import { Input, Textarea, Button, Card } from "@heroui/react";
import { type FormEvent, useState } from "react";

export default function ContactPage() {
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
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" color="primary" size="lg" className="w-full">
            Send Message
          </Button>
        </form>
      </Card>
    </div>
  );
}
