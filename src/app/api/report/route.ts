import { addFeedback } from "@/lib/queries/insert";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // get the form data
  const formData = await req.formData();
  try {
    // Add toilet to database
    await addFeedback(formData);
    return NextResponse.json({ message: "Toilet added successfully" });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to add toilet: " + error,
      status: 500,
    });
  }
}
