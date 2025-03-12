"use client";

import { useEffect, useRef } from "react";

interface CameraCaptureProps {
  isCameraOpen: boolean;
  closeCamera: () => void;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  stream: MediaStream | null;
  files: FileList | null;
}

export function CameraCapture({
  isCameraOpen,
  closeCamera,
  setFiles,
  stream,
  files,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <>
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
    </>
  );
}
