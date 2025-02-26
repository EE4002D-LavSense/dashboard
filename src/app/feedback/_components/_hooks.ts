"use client";
import { v4 as uuidv4 } from "uuid";

export const updateDatabase = async (formData: FormData) => {
  try {
    const response = await fetch("/api/report", {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Failed to submit form", error);
  }
};

export const uploadFiles = async (files: FileList) => {
  const fileKeys: (string | null)[] = await Promise.all(
    Array.from(files).map(async (file) => {
      const response = await getFileUrls(file);
      if (!response) {
        console.error("Failed to get upload URL");
        return null;
      }

      const { url, fields } = response;
      const awsFormData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        awsFormData.append(key, value as string);
      });
      awsFormData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: awsFormData,
      });

      if (!uploadResponse.ok) {
        console.error("S3 Upload Error:", await uploadResponse.text());
        return null;
      }
      return fields.key as string; // Return the file key
    }),
  );

  // Filter out any null values in case of failed uploads
  return fileKeys.filter((key) => key !== null);
};

export const getFileUrls = async (file: File) => {
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        contentType: file.type,
        key: "photos/" + uuidv4(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch {
    console.error("Failed to upload file");
    return null;
  }
};
