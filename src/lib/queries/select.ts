import { db } from "@/lib/db";

import { reportsTable, toiletsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
