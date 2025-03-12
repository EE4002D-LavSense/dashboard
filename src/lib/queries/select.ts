import { db } from "@/lib/db";

import {
  apiLogsTable,
  reportFilesTable,
  reportsTable,
  toiletsTable,
} from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { ToiletReportTable } from "@/lib/definitions";
import { getS3FileUrl } from "../actions";

export async function getToilet(building: string, floor: string, type: string) {
  if (!building || !floor || !type) {
    return await getAllToilets();
  }
  const res = await db
    .select()
    .from(toiletsTable)
    .where(
      and(
        eq(toiletsTable.building, building),
        eq(toiletsTable.floor, floor),
        eq(toiletsTable.type, type),
      ),
    );
  return res;
}

export async function getAllToilets() {
  const res = await db.select().from(toiletsTable);
  return res;
}

export async function getReportId(
  location: string,
  description: string,
  remarks: string,
) {
  const res = await db
    .select()
    .from(reportsTable)
    .where(
      and(
        eq(reportsTable.location, location),
        eq(reportsTable.description, description),
        eq(reportsTable.remarks, remarks),
      ),
    );
  return res[0].id;
}

export async function getAllLogs() {
  return await db
    .select()
    .from(apiLogsTable)
    .orderBy(desc(apiLogsTable.timestamp));
}

export async function getToiletReports(): Promise<ToiletReportTable[]> {
  const result = await fetchToiletReports();
  return Promise.all(result.map(formatReportRow));
}

// Fetch reports from the database and sort by date (latest first)
async function fetchToiletReports() {
  return db
    .select({
      id: reportsTable.id,
      location: reportsTable.location,
      description: reportsTable.description,
      remarks: reportsTable.remarks,
      createdAt: reportsTable.createdAt,
      fileUrls: sql<string[]>`array_agg(${reportFilesTable.filePath})`.as(
        "fileUrls",
      ),
    })
    .from(reportsTable)
    .leftJoin(reportFilesTable, eq(reportsTable.id, reportFilesTable.reportId))
    .groupBy(
      reportsTable.id,
      reportsTable.location,
      reportsTable.description,
      reportsTable.remarks,
      reportsTable.createdAt,
    )
    .orderBy(desc(reportsTable.createdAt)); // Sort by latest date
}

// Generate signed file URLs
async function getSignedFileUrls(fileUrls: string[]): Promise<string[]> {
  return fileUrls[0] !== null ? Promise.all(fileUrls.map(getS3FileUrl)) : [];
}

// Format a report row
async function formatReportRow(row: any) {
  return {
    ...row,
    remarks: row.remarks ?? undefined,
    createdAt: row.createdAt.toLocaleString(),
    fileUrls: await getSignedFileUrls(row.fileUrls),
    location: await getToiletName(row.location),
  };
}

export async function getToiletName(toiletId: string) {
  if (isNaN(parseInt(toiletId))) {
    throw new Error("Invalid toiletId");
  }
  const id = parseInt(toiletId);
  const res = await db
    .select()
    .from(toiletsTable)
    .where(eq(toiletsTable.id, id));
  return res[0].building + "-" + res[0].floor + "-" + res[0].type;
}
