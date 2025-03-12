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
  const result = await db
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
    );

  // Process each report to get signed URLs for its files
  const reportsWithSignedUrls = await Promise.all(
    result.map(async (row) => {
      let signedFileUrls: string[] = [];

      // Check if we have files to process
      if (row.fileUrls[0] !== null) {
        // Generate signed URLs for each file path
        signedFileUrls = await Promise.all(
          row.fileUrls.map((filePath) => getS3FileUrl(filePath)),
        );
      }
      const formatLocation = await getToiletName(row.location);

      return {
        ...row,
        remarks: row.remarks === null ? undefined : row.remarks,
        createdAt: row.createdAt.toLocaleString(),
        fileUrls: signedFileUrls,
        location: formatLocation,
      };
    }),
  );

  return reportsWithSignedUrls;
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
