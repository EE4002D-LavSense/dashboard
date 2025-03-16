"use client";

import Image from "next/image";

export function FilePreview({
  photos,
  audioFile,
}: {
  photos: FileList | null;
  audioFile: File | null;
}) {
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
            <source src={URL.createObjectURL(audioFile)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </>
  );
}
