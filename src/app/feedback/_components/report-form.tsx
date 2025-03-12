"use client";
import { ToiletInfo } from "@/lib/definitions";
import { use, useEffect, useRef, useState } from "react";
import { updateDatabase, uploadFiles } from "./_hooks";
import { Camera } from "lucide-react";
import { CameraCapture } from "./camera-capture";
import { FilePreview } from "./file-preview";
import { AudioCapture } from "./audio-capture";
import { fetchAllToilets } from "@/lib/actions";

export default function ReportForm() {
  const [toiletData, setToiletData] = useState<ToiletInfo[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const resetInputs = () => {
    alert("Report submitted successfully!");
    setLocation("");
    setDescription("");
    setRemarks("");
    setPhotos(null);
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    if (audioInputRef.current) {
      audioInputRef.current.value = ""; // Reset audio input
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    // Form data
    const dbFormData = new FormData();
    dbFormData.append("location", location);
    dbFormData.append("description", description);
    dbFormData.append("remarks", remarks);
    if (photos) {
      const fileKeys = await uploadFiles(photos);
      console.log(fileKeys);
      dbFormData.append("photos", JSON.stringify(fileKeys));

      const response = await updateDatabase(dbFormData);
      if (response) {
        resetInputs();
      }
    } else {
      const response = await updateDatabase(dbFormData);
      if (response) {
        resetInputs();
      }
    }
  };

  const openCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream); // Set the stream state

      setIsCameraOpen(true); // Open camera UI
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Could not access camera. Please check permissions or try using the file upload option.",
      );
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    const fetchToiletData = async () => {
      const data = await fetchAllToilets();
      setToiletData(data);
    };

    fetchToiletData();
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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
          {toiletData.map((toilet) => (
            <option key={toilet.id} value={toilet.id}>
              {`${toilet.building}-${toilet.floor}-${toilet.type}`}
            </option>
          ))}
        </select>

        {/* Upload Photos/Files */}
        <label className="mb-2 block font-medium">Upload Photos</label>
        <div className="mb-4 flex gap-2">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={(e) => setPhotos(e.target.files)}
            className="w-full rounded-md border p-2"
            accept="image/*"
          />
          <button
            type="button"
            onClick={openCamera}
            className="flex items-center justify-center rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
            title="Take a photo"
          >
            <Camera size={20} />
          </button>
        </div>

        {/* Camera UI */}
        <CameraCapture
          isCameraOpen={isCameraOpen}
          closeCamera={closeCamera}
          setPhotos={setPhotos}
          stream={stream}
          photos={photos}
        />

        {/* Record Audio Section */}
        <AudioCapture audioFile={audioFile} setAudioFile={setAudioFile} />
        {/* Show preview of selected files */}
        <FilePreview photos={photos} />

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
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
        >
          {!loading ? "Submit Report" : "Loading ..."}
        </button>
      </form>
    </div>
  );
}
