"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";

export default function AddToiletForm() {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Fetch existing toilets to prevent duplicates
    const res = await fetch(
      `/api/toilet?building=${building}&floor=${floor}&type=${type}`,
    );
    const existingToilets = await res.json();
    console.log(existingToilets);

    if (existingToilets.length > 0) {
      alert("This toilet already exists!");
      setLoading(false);
      return;
    }

    // Send POST request
    const uploadRes = await fetch("/api/toilet", {
      method: "POST",
      body: JSON.stringify({
        location: "",
        building: building,
        floor: floor,
        type: type,
      }),
    });

    if (!uploadRes.ok) {
      alert("Error adding toilet!");
    } else {
      alert("Toilet added successfully!");
    }

    setLoading(false);
  }

  return (
    <Card className="w-full max-w-sm rounded-lg p-6">
      <CardHeader title="Add New Toilet">
        <h2 className="text-xl font-bold">Add New Toilet</h2>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          {/* Building */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Building</label>
            <Input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              required
            />
          </div>

          {/* Floor */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Floor</label>
            <Input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Type</label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Select type"
              required
            >
              <SelectItem key="MALE">Male</SelectItem>
              <SelectItem key="FEMALE">Female</SelectItem>
              <SelectItem key="OTHER">Other</SelectItem>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            color="primary"
            size="lg"
          >
            {loading ? "Submitting..." : "Add Toilet"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
