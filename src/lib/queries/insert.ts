import { db } from "@/lib/db";

import { toiletsTable } from "@/lib/db/schema";
import { ToiletInfo } from "@/lib/definitions";

export async function addToilet(data: ToiletInfo) {
  await db.insert(toiletsTable).values(data);
}
