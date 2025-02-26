import { addApiLog } from "@/lib/queries/insert";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  await addApiLog({
    method: "POST",
    data: JSON.stringify(data),
    status: "OK",
  });
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
