CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved');--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "status" "report_status" DEFAULT 'pending' NOT NULL;