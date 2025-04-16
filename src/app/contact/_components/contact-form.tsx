"use client";

import { Input, Textarea, Button, Form, addToast, Card } from "@heroui/react";
import { type FormEvent, useState } from "react";

import { sendContactMessage } from "./_hook";

import Title from "@/components/common/title";

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

  const resetInput = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const response = await sendContactMessage(
      formData.name,
      formData.email,
      formData.subject,
      formData.message,
    );
    if (response.status == 200) {
      addToast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        color: "success",
      });
      resetInput();
    } else {
      addToast({
        title: "Error",
        description: "There was an error sending your message.",
        color: "danger",
      });
    }
    // Add form submission logic, e.g., sending data to an API
  };
  return (
    <Card className="w-full max-w-md p-8 shadow-lg">
      <Title title="Contact Us" />
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
    </Card>
  );
}
