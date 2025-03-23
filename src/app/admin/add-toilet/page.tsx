import { type Metadata } from "next";

import AddToiletForm from "@/app/admin/add-toilet/_components/add-toilet-form";
import { checkAdmin } from "@/lib/server-utils";

export const metadata: Metadata = {
  title: "Add Toilet",
};

export default async function AddToiletPage() {
  await checkAdmin();
  return (
    <div className="flex justify-center p-8">
      <AddToiletForm />
    </div>
  );
}
