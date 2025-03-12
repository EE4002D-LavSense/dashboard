"use client";
import { ToiletInfo } from "@/lib/definitions";
import { useEffect, useRef, useState } from "react";
import { updateDatabase, uploadFiles } from "./_hooks";
import { Camera } from "lucide-react";

export default function ReportForm() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [toiletsInfo, setToiletsInfo] = useState<ToiletInfo[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a File object
              const file = new File([blob], `photo_${Date.now()}.jpg`, {
                type: "image/jpeg",
              });

              // Create a FileList-like object
              const dataTransfer = new DataTransfer();

              // Add existing files if any
              if (files) {
                Array.from(files).forEach((existingFile) => {
                  dataTransfer.items.add(existingFile);
                });
              }

              // Add the new file
              dataTransfer.items.add(file);

              // Update files state
              setFiles(dataTransfer.files);

              // Close camera
              closeCamera();
            }
          },
          "image/jpeg",
          0.95,
        );
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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

    // Cleanup on component unmount
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
          {toiletsInfo.map((toilet) => (
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
            onChange={(e) => setFiles(e.target.files)}
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
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="w-full max-w-lg rounded-lg bg-white p-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-auto w-full rounded"
                ></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={takePhoto}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Take Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show preview of selected files */}
        {files && files.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">
              {files.length} file(s) selected
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="relative h-16 w-16 overflow-hidden rounded"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
