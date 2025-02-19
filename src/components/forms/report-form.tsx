"use client";

import { useState } from "react";

export default function ReportForm() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form data
    const formData = new FormData();
    formData.append("location", location);
    formData.append("description", description);
    formData.append("remarks", remarks);
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file));
    }

    // Example: send form data to an API
    console.log("Form submitted", { location, description, remarks, files });
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold">Report a Toilet Issue</h2>

        {/* Toilet Location */}
        <label className="mb-2 block font-medium">Toilet Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mb-4 w-full rounded-md border p-2"
          required
        >
          <option value="" disabled>
            Select location
          </option>
          <option value="1st Floor">1st Floor</option>
          <option value="2nd Floor">2nd Floor</option>
          <option value="3rd Floor">3rd Floor</option>
        </select>

        {/* Upload Photos/Files */}
        <label className="mb-2 block font-medium">Upload Photos</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="mb-4 w-full rounded-md border p-2"
          accept="image/*"
        />

        {/* Problem Description */}
        <label className="mb-2 block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 h-24 w-full rounded-md border p-2"
          placeholder="Describe the issue..."
          required
        />

        {/* Remarks */}
        <label className="mb-2 block font-medium">Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="mb-4 h-20 w-full rounded-md border p-2"
          placeholder="Any additional remarks..."
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
