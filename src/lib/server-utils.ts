import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { isAdmin } from "./queries/select";

export async function checkAdmin() {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    notFound();
  }
}
