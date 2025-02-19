import { addToilet } from "@/lib/queries/insert";
import { ToiletInfo } from "@/lib/definitions";
import { getToilet } from "@/lib/queries/select";

export async function POST(req: Request) {
  const { location, building, floor, type } = await req.json();

  try {
    // Add toilet to database
    const toilet: ToiletInfo = {
      location,
      building,
      floor,
      type,
    };
    await addToilet(toilet);
    return Response.json({ message: "Toilet added successfully" });
  } catch (error) {
    return Response.json({ message: "Failed to add toilet" });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const building = url.searchParams.get("building");
  const floor = url.searchParams.get("floor");
  const type = url.searchParams.get("type");
  const res = await getToilet(building ?? "", floor ?? "", type ?? "");
  return Response.json(res);
}
