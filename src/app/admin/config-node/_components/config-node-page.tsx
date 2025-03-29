"use client";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { addToiletNodeAction, fetchAllToilets } from "@/lib/actions";

export default function ConfigNodeForm() {
  const [node, setNode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toiletId, setToiletId] = useState(0);

  const queryClient = useQueryClient();

  const resetInputs = () => {
    setNode("");
    setLoading(false);
  };

  const { data: toilets } = useQuery({
    queryKey: ["toilets"],
    queryFn: fetchAllToilets,
  });

  const addToiletNodeMutation = useMutation({
    mutationFn: ({ node, toiletId }: { node: string; toiletId: number }) => {
      return addToiletNodeAction(node, toiletId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toiletIdList"] });
      addToast({
        title: "Success",
        description: "Toilet linked successfully!",
        color: "success",
      });
      resetInputs();
      setLoading(false);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Send POST request
    addToiletNodeMutation.mutate({ node, toiletId });
  }

  return (
    <Card className="w-full max-w-sm rounded-lg p-6">
      <CardHeader title="Add New Toilet">
        <h2 className="text-xl font-bold">Link ESP32 Node to Toilet</h2>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          {/* Building */}
          <div className="mb-4 w-full">
            <label className="mb-2 block">Node Address</label>
            <Input
              aria-label="Node"
              type="text"
              value={node}
              placeholder="Node Address e.g. 0x0258"
              onChange={(e) => setNode(e.target.value)}
              required
            />
          </div>
          <Select
            label="Select location"
            selectedKeys={toiletId ? new Set([toiletId]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]; // Extract first key
              if (typeof selectedKey === "string") {
                setToiletId(Number(selectedKey)); // Ensure it's a string before updating state
              }
            }}
            className="w-full"
            isRequired
          >
            {toilets?.map((toilet) => (
              <SelectItem key={toilet.id}>
                {`${toilet.building}-${toilet.floor}-${toilet.type}`}
              </SelectItem>
            )) ?? null}
          </Select>

          {/* Submit Button */}
          <Button
            aria-label="Submit"
            type="submit"
            disabled={loading}
            className="mt-4 w-full"
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
