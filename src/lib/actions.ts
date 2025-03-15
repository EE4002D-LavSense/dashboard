"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { getToiletReports, getToiletReportsCount } from "@/lib/queries/select";
import { getAllToilets } from "@/lib/queries/select";

export async function getS3FileUrl(key: string) {
  const client = new S3Client({ region: process.env.AWS_REGION });

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }),
  );
}

export async function getReportsAction(page: number, rowPerPage: number) {
  // Revalidate data
  revalidatePath("/admin/dashboard");
  return await getToiletReports(page, rowPerPage);
}

export async function getReportsCountAction() {
  revalidatePath("/admin/dashboard");
  return (await getToiletReportsCount())[0].count;
}

export async function fetchAllToilets() {
  revalidatePath("/feedback");
  return await getAllToilets();
}
