import { db } from "@/lib/db";

import { reportFilesTable, reportsTable, toiletsTable } from "@/lib/db/schema";
import { ToiletInfo } from "@/lib/definitions";
import { getReportId } from "./select";

export async function addToilet(data: ToiletInfo) {
  await db.insert(toiletsTable).values(data);
}

export async function addFeedback(data: FormData) {
  const location = data.get("location") as string;
  const description = data.get("description") as string;
  const remarks = data.get("remarks") as string;
  const photos = JSON.parse(data.get("photos") as string);

  await db.insert(reportsTable).values({
    location,
    description,
    remarks,
  });

  const reportId = await getReportId(location, description, remarks);

  photos.forEach(async (filePath: string) => {
    await db.insert(reportFilesTable).values({ reportId, filePath });
  });
}
