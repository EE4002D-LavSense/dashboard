import { type Metadata } from "next";

import ConfigNodeForm from "./_components/config-node-page";

import { checkAdmin } from "@/lib/server-utils";

export const metadata: Metadata = {
  title: "Config Node",
};

export default async function ConfigNodePage() {
  await checkAdmin();
  return (
    <>
      <div className="flex justify-center p-8">
        <ConfigNodeForm />
      </div>
    </>
  );
}
