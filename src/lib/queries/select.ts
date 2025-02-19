import { db } from "@/lib/db";

import { toiletsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getToilet(building: string, floor: string, type: string) {
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

export async function getToilets() {
  const res = await db.select().from(toiletsTable);
  return res;
}
