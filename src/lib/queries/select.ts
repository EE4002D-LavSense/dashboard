import {
  eq,
  and,
  desc,
  sql,
  count,
  max,
  countDistinct,
  gte,
} from "drizzle-orm";

import { getS3FileUrl } from "../actions";

import { db } from "@/lib/db";
import {
  usersTable,
  apiLogsTable,
  reportFilesTable,
  reportsTable,
  toiletsTable,
  nodeToToiletIdTable,
  toiletSensorsTable,
  nodeStatusTable,
} from "@/lib/db/schema";
import { type ToiletReportTable } from "@/lib/definitions";

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

export async function getMainDashboardData(page: number, rowsPerPage: number) {
  const offset = (page - 1) * rowsPerPage; // Calculate the starting row
  const latestToilet = db
    .select({
      toiletId: toiletSensorsTable.toiletId,
      latest_timestamp: max(toiletSensorsTable.timestamp).as(
        "latest_timestamp",
      ),
    })
    .from(toiletSensorsTable)
    .groupBy(toiletSensorsTable.toiletId)
    .as("latestToilet");

  const latestHeartBeatData = db
    .select({
      nodeId: nodeStatusTable.nodeId,
      latest_timestamp: max(nodeStatusTable.timestamp).as("latest_timestamp"),
    })
    .from(nodeStatusTable)
    .groupBy(nodeStatusTable.nodeId)
    .as("latestHeartBeatData");

  const latestHeartBeatStatus = db
    .select({
      nodeId: latestHeartBeatData.nodeId,
      toiletId: nodeToToiletIdTable.toiletId,
      heartBeatStatus: nodeStatusTable.heartbeatStatus,
    })
    .from(nodeStatusTable)
    .innerJoin(
      latestHeartBeatData,
      and(
        eq(nodeStatusTable.nodeId, latestHeartBeatData.nodeId),
        eq(latestHeartBeatData.latest_timestamp, nodeStatusTable.timestamp),
      ),
    )
    .innerJoin(
      nodeToToiletIdTable,
      eq(nodeToToiletIdTable.nodeId, latestHeartBeatData.nodeId),
    )
    .as("latestHeartBeatStatus");

  return await db
    .select({
      id: toiletSensorsTable.toiletId,
      name: sql<string>`CONCAT(${toiletsTable.building}, '-', ${toiletsTable.floor}, '-', ${toiletsTable.type})`,
      gender: toiletsTable.type,
      cleanliness: toiletSensorsTable.cleanliness,
      occupancy: sql<string>`CONCAT(LEAST(${toiletSensorsTable.occupancy}, ${toiletsTable.capacity}), '/', ${toiletsTable.capacity})`,
      timestamp: sql<string>`CONCAT(${latestToilet.latest_timestamp})`,
      heartBeatStatus: latestHeartBeatStatus.heartBeatStatus,
    })
    .from(toiletSensorsTable)
    .innerJoin(toiletsTable, eq(toiletsTable.id, toiletSensorsTable.toiletId))
    .innerJoin(
      latestToilet,
      and(eq(toiletSensorsTable.timestamp, latestToilet.latest_timestamp)),
    )
    .leftJoin(
      latestHeartBeatStatus,
      eq(toiletSensorsTable.toiletId, latestHeartBeatStatus.toiletId),
    )
    .orderBy(desc(toiletsTable.id))
    .limit(rowsPerPage)
    .offset(offset);
}

export async function getMainDashboardDataCount() {
  return await db
    .select({
      count: countDistinct(toiletSensorsTable.toiletId),
    })
    .from(toiletSensorsTable)
    .groupBy(toiletSensorsTable.toiletId);
}

export async function getApiLogs(page: number, rowsPerPage: number) {
  const offset = (page - 1) * rowsPerPage; // Calculate the starting row
  return await db
    .select()
    .from(apiLogsTable)
    .orderBy(desc(apiLogsTable.timestamp))
    .limit(rowsPerPage)
    .offset(offset);
}

export async function getApiLogsCount() {
  return await db.select({ count: count() }).from(apiLogsTable);
}

export async function getToiletReportsCount() {
  return await db.select({ count: count() }).from(reportsTable);
}

export async function getToiletReports(
  page: number,
  rowPerPage: number,
): Promise<ToiletReportTable[]> {
  const result = await fetchToiletReports(page, rowPerPage);
  return Promise.all(result.map(formatReportRow));
}

// Fetch reports from the database and sort by date (latest first)
async function fetchToiletReports(page: number, rowsPerPage: number) {
  const offset = (page - 1) * rowsPerPage; // Calculate the starting row

  return db
    .select({
      id: reportsTable.id,
      location: reportsTable.location,
      description: reportsTable.description,
      remarks: reportsTable.remarks,
      status: reportsTable.status,
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
    .orderBy(desc(reportsTable.createdAt)) // Sort by latest date
    .limit(rowsPerPage)
    .offset(offset);
}

// Generate signed file URLs
async function getSignedFileUrls(fileUrls: string[]): Promise<string[]> {
  return fileUrls[0] !== null ? Promise.all(fileUrls.map(getS3FileUrl)) : [];
}

// Format a report row
async function formatReportRow(row: {
  id: number;
  description: string;
  remarks: string | null;
  createdAt: { toLocaleString: () => string };
  status: string;
  fileUrls: string[];
  location: string;
}) {
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

export async function isAdmin(userId: string): Promise<boolean> {
  const res = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.id, userId), eq(usersTable.role, "admin")));
  return res.length > 0;
}

export async function getToiletIdFromNodeId(nodeId: string) {
  const res = await db
    .select()
    .from(nodeToToiletIdTable)
    .where(eq(nodeToToiletIdTable.nodeId, nodeId));
  return res[0].toiletId;
}

export async function getChartData(
  category: string,
  toiletId: number,
  timeRange: string,
) {
  // Define the mapping between categories and database columns
  const categoryMap = {
    occupancy: toiletSensorsTable.occupancy,
    cleanliness: toiletSensorsTable.cleanliness,
    waterLeak: toiletSensorsTable.waterLeak,
    humidity: toiletSensorsTable.humidity,
    temperature: toiletSensorsTable.temperature,
  };

  // Ensure the requested category exists, otherwise select all
  const selectedFields = {
    timestamp: toiletSensorsTable.timestamp,
    toiletId: toiletSensorsTable.toiletId,
    ...(Object.keys(categoryMap).includes(category)
      ? { [category]: categoryMap[category as keyof typeof categoryMap] }
      : categoryMap),
  };

  // Calculate the start date based on timeRange
  const now = new Date();
  const startDate = new Date();

  if (timeRange === "90d") startDate.setDate(now.getDate() - 90);
  else if (timeRange === "30d") startDate.setDate(now.getDate() - 30);
  else if (timeRange === "7d") startDate.setDate(now.getDate() - 7);

  // Fetch only data within the time range
  const res = await db
    .select(selectedFields)
    .from(toiletSensorsTable)
    .where(
      and(
        eq(toiletSensorsTable.toiletId, toiletId),
        gte(toiletSensorsTable.timestamp, startDate),
      ),
    )
    .orderBy(toiletSensorsTable.timestamp);

  return res;
}

export async function getAllToiletSensorsData() {
  const res = await db
    .select({
      name: sql<string>`CONCAT(${toiletsTable.building}, '-', ${toiletsTable.floor}, '-', ${toiletsTable.type})`,
      timestamp: toiletSensorsTable.timestamp,
      occupancy: toiletSensorsTable.occupancy,
      cleanliness: toiletSensorsTable.cleanliness,
      waterLeak: toiletSensorsTable.waterLeak,
      humidity: toiletSensorsTable.humidity,
      temperature: toiletSensorsTable.temperature,
    })
    .from(toiletsTable)
    .innerJoin(
      toiletSensorsTable,
      eq(toiletsTable.id, toiletSensorsTable.toiletId),
    )
    .orderBy(toiletSensorsTable.timestamp);
  return res;
}

export async function getAllToiletIdWithSensorsData() {
  const toiletWithData = db
    .select({
      toiletId: toiletSensorsTable.toiletId,
    })
    .from(toiletSensorsTable)
    .groupBy(toiletSensorsTable.toiletId)
    .as("toiletWithData");
  const res = await db
    .select({
      toiletId: toiletWithData.toiletId,
      name: sql<string>`CONCAT(${toiletsTable.building}, '-', ${toiletsTable.floor}, '-', ${toiletsTable.type})`,
    })
    .from(toiletWithData)
    .innerJoin(toiletsTable, eq(toiletsTable.id, toiletWithData.toiletId));
  return res;
}

export async function getToiletNode(nodeId: string) {
  const res = await db
    .select()
    .from(nodeToToiletIdTable)
    .where(eq(nodeToToiletIdTable.nodeId, nodeId));
  return res;
}
