"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";

import { type ToiletInfo } from "./definitions";
import { addFeedback, addToilet, addToiletNode } from "./queries/insert";
import { toggleReportStatus } from "./queries/update";

import { EmailTemplate } from "@/components/common/email-template";
import {
  getAllToiletIdWithSensorsData,
  getAllToiletSensorsData,
  getApiLogs,
  getApiLogsCount,
  getChartData,
  getMainDashboardData,
  getMainDashboardDataCount,
  getToilet,
  getToiletNode,
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

export async function fetchChartData(
  category: string,
  toiletId: number,
  timeRange: string,
) {
  return await getChartData(category, toiletId, timeRange);
}

export async function fetchAllToiletSensorsData() {
  return await getAllToiletSensorsData();
}

export async function fetchAllToiletIdWithSensorsData() {
  return await getAllToiletIdWithSensorsData();
}

export async function addToiletNodeAction(node: string, toiletId: number) {
  const exists = await getToiletNode(node);
  if (exists.length > 0) {
    throw new Error("Node already exists!");
  }
  return await addToiletNode(node, toiletId);
}

export async function sendContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: "email",
      to: ["non.k@u.nus.edu"],
      subject: subject,
      react: EmailTemplate({ name, email, subject, message }),
    });

    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return error;
  }
}
