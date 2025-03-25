import { eq } from "drizzle-orm";

import { reportsTable } from "../db/schema";

import { db } from "@/lib/db";

export async function toggleReportStatus(reportIds: number[]) {
  for (const id of reportIds) {
    const curStatus = (
      await db
        .select({ status: reportsTable.status })
        .from(reportsTable)
        .where(eq(reportsTable.id, id))
    )[0].status;
    await db
      .update(reportsTable)
      .set({ status: curStatus == "resolved" ? "pending" : "resolved" })
      .where(eq(reportsTable.id, id));
  }
}
