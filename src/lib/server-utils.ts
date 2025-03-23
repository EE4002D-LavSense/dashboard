import { auth } from "@clerk/nextjs/server";

import { isAdmin } from "./queries/select";
import { notFound } from "next/navigation";

export async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
  if (!(await isAdmin(userId))) {
    notFound();
  }
}
