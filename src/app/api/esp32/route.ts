import { NextResponse } from "next/server";

import { type Esp32ToiletData } from "@/lib/definitions";
import { addApiLog, addToiletSensorData } from "@/lib/queries/insert";

function isToiletSensorData(data: unknown): data is Esp32ToiletData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return (
    "node_id" in data &&
    "cleanliness" in data &&
    "occupancy" in data &&
    "water_leak" in data &&
    "temperature" in data &&
    "humidity" in data
  );
}

export async function POST(request: Request) {
  const data = await request.json();
  await addApiLog({
    method: "POST",
    data: JSON.stringify(data),
    status: "OK",
  });
  // check if data is of type toiletSensorType
  if (isToiletSensorData(data)) {
    // Transform water_leak from number to boolean
    const transformedData = {
      ...data,
      water_leak: Boolean(data.water_leak),
    };
    await addToiletSensorData(transformedData);
  }
  return NextResponse.json({
    message: "received: " + JSON.stringify(data),
  });
}

export async function GET(_request: Request) {
  await addApiLog({
    method: "GET",
    data: "",
    status: "OK",
  });
  return NextResponse.json({
    message: "Test api endpoint for ESP32",
    status: "OK",
  });
}
