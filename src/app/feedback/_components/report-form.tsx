"use client";

import { ToiletInfo } from "@/lib/definitions";
import { useEffect, useRef, useState } from "react";
import { updateDatabase, uploadFiles } from "./_hooks";

export default function ReportForm() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [toiletsInfo, setToiletsInfo] = useState<ToiletInfo[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form data
    const dbFormData = new FormData();
    dbFormData.append("location", location);
    dbFormData.append("description", description);
    dbFormData.append("remarks", remarks);

    if (files) {
      const fileKeys = await uploadFiles(files);
      console.log(fileKeys);
      dbFormData.append("photos", JSON.stringify(fileKeys));
      console.log(dbFormData);
      const response = await updateDatabase(dbFormData);
      if (response) {
        alert("Report submitted successfully!");
        setLocation("");
        setDescription("");
        setRemarks("");
        setFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    }
  };

  useEffect(() => {
    const fetchToilets = async () => {
      try {
        const res = await fetch("/api/toilet");
        const data = await res.json();
        setToiletsInfo(data);
      } catch (error) {
        console.error("Failed to fetch toilets", error);
      }
    };

    fetchToilets();
  }, []);

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
          {toiletsInfo.map((toilet) => (
            <option key={toilet.id} value={toilet.id}>
              {`${toilet.building}-${toilet.floor}-${toilet.type}`}
            </option>
          ))}
        </select>

        {/* Upload Photos/Files */}
        <label className="mb-2 block font-medium">Upload Photos</label>
        <input
          type="file"
          multiple
          ref={fileInputRef}
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
