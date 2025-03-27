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
  Textarea,
} from "@heroui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { updateDatabase, uploadFiles } from "./_hooks";
import { AudioCapture } from "./audio-capture";
import { CameraCapture } from "./camera-capture";
import { FilePreview } from "./file-preview";

import { fetchAllToilets } from "@/lib/actions";
import { type ToiletInfo } from "@/lib/definitions";

export default function ReportForm() {
  const [toiletData, setToiletData] = useState<ToiletInfo[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (dataForm: FormData) => {
      return await updateDatabase(dataForm);
    },
    onSuccess: () => {
      resetInputs();
      addToast({
        title: "Success",
        description: "Report submitted successfully!",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalPage"],
      });
    },
  });

  const resetInputs = () => {
    setLocation("");
    setDescription("");
    setRemarks("");
    setFiles(null);
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    if (audioInputRef.current) {
      audioInputRef.current.value = ""; // Reset audio input
    }
    setLoading(false);
  };

  const transcribe = useCallback(async (audioFile: File) => {
    try {
      const audioFormData = new FormData();
      audioFormData.append("audio", audioFile as File);
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioFormData,
      });
      const transcript = await response.json();
      setDescription(transcript.message);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fileToFileList = (file: File): FileList => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.dataTransfer.files.length) return;

    const newFiles = Array.from(e.dataTransfer.files);
    const dataTransfer = new DataTransfer();

    // Append existing files
    if (files) {
      Array.from(files).forEach((file) => dataTransfer.items.add(file));
    }

    // Append new files
    newFiles.forEach((file) => dataTransfer.items.add(file));

    setFiles(dataTransfer.files); // Update state with new FileList
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    // Form data
    const dbFormData = new FormData();
    dbFormData.append("location", location);
    dbFormData.append("description", description);
    dbFormData.append("remarks", remarks);
    if (files || audioFile) {
      try {
        const uploadPromises = [];

        // Add photos upload promise if photos exist
        if (files && files.length > 0) {
          uploadPromises.push(uploadFiles(files));
        }

        // Add audio upload promise if audio exists
        if (audioFile) {
          uploadPromises.push(uploadFiles(fileToFileList(audioFile)));
        }

        // Wait for all uploads to complete concurrently
        const uploadResults = await Promise.all(uploadPromises);

        // Flatten array of file keys
        const allFiles = uploadResults.flat();
        console.log(allFiles);

        // Proceed with database update
        dbFormData.append("files", JSON.stringify(allFiles));
        mutation.mutate(dbFormData);
      } catch (error) {
        console.error("Error during file upload:", error);
        // Handle the error appropriately
      }
    } else {
      mutation.mutate(dbFormData);
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

  // Process audio file
  useEffect(() => {
    if (!audioFile) return;
    setDescription("Transcribing audio ...");
    transcribe(audioFile);
  }, [audioFile, transcribe]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md rounded-lg p-6">
        <CardHeader title="Report a Toilet Issue">
          <h2 className="text-xl font-semibold">Report a Toilet Issue</h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            {/* Toilet Location */}
            <label className="mb-2 block font-medium">Location</label>
            <Select
              label="Select location"
              selectedKeys={location ? new Set([location]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]; // Extract first key
                if (typeof selectedKey === "string") {
                  setLocation(selectedKey); // Ensure it's a string before updating state
                }
              }}
              className="w-full"
              isRequired
            >
              {toiletData.map((toilet) => (
                <SelectItem key={toilet.id}>
                  {`${toilet.building}-${toilet.floor}-${toilet.type}`}
                </SelectItem>
              ))}
            </Select>

            {/* Upload Photos/Files */}
            <label className="mb-2 block font-medium">
              Choose file(s) or drag them here
            </label>
            <div
              className={`mb-4 flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                isDragging ? "border-blue-500" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => setFiles(e.target.files)}
                className="w-full rounded-md"
                accept="image/*,audio/*"
              />
              <Button
                type="button"
                onPress={openCamera}
                className="flex items-center justify-center bg-blue-500 px-3 py-3 text-white hover:bg-blue-600"
                title="Take a photo"
              >
                <Camera size={20} />
              </Button>
            </div>

            {/* Camera UI */}
            <CameraCapture
              isCameraOpen={isCameraOpen}
              closeCamera={closeCamera}
              setPhotos={setFiles}
              stream={stream}
              photos={files}
            />

            {/* Record Audio Section */}
            <AudioCapture setAudioFile={setAudioFile} />
            {/* Show preview of selected files */}
            <FilePreview
              photos={files}
              audioFile={audioFile}
              setFiles={setFiles}
              setAudioFile={setAudioFile}
            />

            {/* Problem Description */}
            <label className="block font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md"
              placeholder="Describe the issue..."
              required
            />

            {/* Remarks */}
            <label className="block font-medium">Remarks</label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-md"
              placeholder="Any additional remarks..."
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full"
              color="primary"
              size="lg"
            >
              {!loading ? "Submit Report" : "Loading ..."}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
