"use client";

import { addToiletAction, getToiletAction } from "@/lib/actions";
import { ToiletInfo } from "@/lib/definitions";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AddToiletForm() {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState(0);

  const queryClient = useQueryClient();

  const resetInputs = () => {
    setBuilding("");
    setFloor("");
    setType("");
    setCapacity(0);
    setLoading(false);
  };

  const addToiletMutation = useMutation({
    mutationFn: (data: ToiletInfo) => {
      setLoading(true);
      return addToiletAction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toilets"] });
      addToast({
        title: "Success",
        description: "Toilet added successfully!",
        color: "success",
      });
      resetInputs();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Fetch existing toilets to prevent duplicates
    const existingToilets = await getToiletAction(building, floor, type);

    if (existingToilets.length > 0) {
      addToast({
        title: "Error",
        description: "Toilet already exists!",
        color: "danger",
      });
      setLoading(false);
      return;
    }

    // Send POST request
    addToiletMutation.mutate({ building, floor, type, capacity });

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
              aria-label="Building"
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
              aria-label="Floor"
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
            />
          </div>

          {/* Capacity */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Capacity</label>
            <Input
              aria-label="Capacity"
              type="number"
              value={capacity as unknown as string}
              onChange={(e) => setCapacity(e.target.value as unknown as number)}
              required
            />
          </div>

          {/* Type */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Type</label>
            <Select
              aria-label="Type"
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
            aria-label="Submit"
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
