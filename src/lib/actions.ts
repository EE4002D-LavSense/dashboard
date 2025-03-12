import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
