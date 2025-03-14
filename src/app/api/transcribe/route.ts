import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DG_API_KEY);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("audio") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    buffer,
    { model: "nova-3" },
  );

  if (error) {
    console.error(error);
    return Response.json({ message: "Failed to transcribe audio" });
  }
  const transcript = result.results.channels[0].alternatives[0].transcript;

  return Response.json({
    message: transcript,
  });
}
