"use client";

import { Button } from "@heroui/react";
import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

export function AudioCapture({
  setAudioFile,
}: {
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioRecorder(recorder);
      setAudioFile(null);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);
        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      };

      recorder.onstop = () => {
        setIsRecording(false);
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Create audio file
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([audioBlob], `audio_${Date.now()}.webm`, {
          type: "audio/webm",
          lastModified: Date.now(),
        });
        setAudioFile(file);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (audioRecorder && audioRecorder.state !== "inactive") {
      audioRecorder.stop();
    }
  };

  // Format recording time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <label className="mb-2 block font-medium">Record Audio Description</label>
      <div className="mb-4 w-full">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button
              type="button"
              onPress={startRecording}
              className="flex w-full items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
            >
              <Mic size={18} />
              Record Audio
            </Button>
          ) : (
            <Button
              type="button"
              onPress={stopRecording}
              className="flex w-full items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-800"
            >
              <Square size={18} />
              Stop Recording ({formatTime(recordingTime)})
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
