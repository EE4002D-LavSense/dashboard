"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";

import { toggleReportStatus } from "./queries/update";

import {
  getApiLogs,
  getApiLogsCount,
  getToiletReports,
  getToiletReportsCount,
  isAdmin,
} from "@/lib/queries/select";
import { getAllToilets } from "@/lib/queries/select";
import { addFeedback } from "./queries/insert";

export async function getS3FileUrl(key: string) {
  const client = new S3Client({ region: process.env.AWS_REGION });

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }),
  );
}

export async function fetchReports(page: number, rowPerPage: number) {
  return await getToiletReports(page, rowPerPage);
}

export async function fetchReportsCount() {
  return (await getToiletReportsCount())[0].count;
}

export async function fetchAllToilets() {
  return await getAllToilets();
}

export async function fetchLogsCount() {
  return (await getApiLogsCount())[0].count;
}

export async function fetchApiLogs(page: number, rowPerPage: number) {
  return (await getApiLogs(page, rowPerPage)).map((log) => ({
    ...log,
    timestamp: new Date(log.timestamp).toLocaleString("en-GB", {
      timeZone: "Asia/Singapore",
    }),
  }));
}

export async function checkIsAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
  return isAdmin(userId);
}

export async function toggleReportStatusAction(reportIds: number[]) {
  await toggleReportStatus(reportIds);
}

export async function addFeedbackAction(formData: FormData) {
  await addFeedback(formData);
}
