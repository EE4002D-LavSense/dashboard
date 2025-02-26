import { getAllLogs } from "@/lib/queries/select";
import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  try {
    const response = await getAllLogs();
    return NextResponse.json({ logs: response });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
