import AddToiletForm from "@/app/admin/add-toilet/_components/add-toilet-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Toilet",
};

export default function AddToiletPage() {
  return (
    <div className="flex justify-center p-8">
      <AddToiletForm />
    </div>
  );
}
