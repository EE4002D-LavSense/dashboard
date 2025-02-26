"use client";

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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold">Add New Toilet</h2>

      {/* Building */}
      <div className="mb-4">
        <label className="block text-gray-700">Building</label>
        <input
          type="text"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          required
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Floor */}
      <div className="mb-4">
        <label className="block text-gray-700">Floor</label>
        <input
          type="text"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          required
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="block text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full rounded border border-gray-300 p-2"
        >
          <option value="">Select Type</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Add Toilet"}
      </button>
    </form>
  );
}
