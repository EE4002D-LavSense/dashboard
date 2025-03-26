"use client";

import { useEffect } from "react";
import Image from "next/image";

export function FilePreview({
  photos,
  audioFile,
  setFiles,
  setAudioFile,
}: {
  photos: FileList | null;
  audioFile: File | null;
  setFiles: (files: FileList | null) => void;
  setAudioFile: (file: File | null) => void;
}) {
  useEffect(() => {
    if (!photos) return;

    const dataTransfer = new DataTransfer();
    let foundAudio: File | null = null;

    Array.from(photos).forEach((file) => {
      if (file.type.includes("audio") && !foundAudio) {
        foundAudio = file; // Assign the first audio file found
      } else {
        dataTransfer.items.add(file); // Keep non-audio files
      }
    });

    if (foundAudio) {
      setAudioFile(foundAudio);
      setFiles(dataTransfer.files); // Update photos without audio files
    }
  }, [photos, setAudioFile, setFiles]);

  return (
    <>
      {photos && photos.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">
            {photos.length} file(s) selected
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(photos).map((file, index) => (
              <div
                key={index}
                className="relative h-16 w-16 overflow-hidden rounded"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {audioFile && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">1 audio file selected</p>
          <audio controls playsInline>
            <source
              src={URL.createObjectURL(audioFile)}
              type={audioFile.type}
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </>
  );
}
