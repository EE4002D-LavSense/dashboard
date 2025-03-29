"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";

import { type ToiletInfo } from "./definitions";
import { addFeedback, addToilet } from "./queries/insert";
import { toggleReportStatus } from "./queries/update";

import {
  getAllToiletIdWithSensorsData,
  getAllToiletSensorsData,
  getApiLogs,
  getApiLogsCount,
  getChartData,
  getMainDashboardData,
  getMainDashboardDataCount,
  getToilet,
  getToiletReports,
  getToiletReportsCount,
  isAdmin,
} from "@/lib/queries/select";
import { getAllToilets } from "@/lib/queries/select";

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

export async function fetchMainDashboard(page: number, rowPerPage: number) {
  return await getMainDashboardData(page, rowPerPage);
}

export async function fetchMainDashboardCount() {
  return (await getMainDashboardDataCount())[0].count;
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

export async function addToiletAction(data: ToiletInfo) {
  await addToilet(data);
}

export async function getToiletAction(
  building: string,
  floor: string,
  type: string,
) {
  return await getToilet(building, floor, type);
}

export async function fetchChartData(category: string, toiletId: number) {
  return await getChartData(category, toiletId);
}

export async function fetchAllToiletSensorsData() {
  return await getAllToiletSensorsData();
}

export async function fetchAllToiletIdWithSensorsData() {
  return await getAllToiletIdWithSensorsData();
}
