import { getReportId, getToiletIdFromNodeId } from "./select";

import { db } from "@/lib/db";
import {
  apiLogsTable,
  reportFilesTable,
  reportsTable,
  toiletSensorsTable,
  toiletsTable,
  usersTable,
} from "@/lib/db/schema";
import { type Esp32ToiletData, type ToiletInfo } from "@/lib/definitions";

export async function addToilet(data: ToiletInfo) {
  await db.insert(toiletsTable).values(data);
}

export async function addFeedback(data: FormData) {
  const location = data.get("location") as string;
  const description = data.get("description") as string;
  const remarks = data.get("remarks") as string;
  const files = JSON.parse(data.get("files") as string);

  await db.insert(reportsTable).values({
    location,
    description,
    remarks,
  });

  const reportId = await getReportId(location, description, remarks);
  await Promise.all(
    files.map((filePath: string) =>
      db.insert(reportFilesTable).values({ reportId, filePath }),
    ),
  );
}

export async function addApiLog(data: {
  method: string;
  data: string;
  status: string;
}) {
  await db.insert(apiLogsTable).values(data);
}

export async function addUser(
  userId: string,
  first_name: string | null,
  last_name: string | null,
  email: string,
) {
  await db
    .insert(usersTable)
    .values({ id: userId, first_name, last_name, email });
}

export async function addToiletSensorData(data: Esp32ToiletData) {
  const toiletId = await getToiletIdFromNodeId(data.node_address);
  await db.insert(toiletSensorsTable).values({
    toiletId: toiletId,
    cleanliness: data.cleanliness,
    occupancy: data.occupancy,
    humidity: data.humidity,
    waterLeak: data.water_leak,
    temperature: data.temperature,
  });
}
