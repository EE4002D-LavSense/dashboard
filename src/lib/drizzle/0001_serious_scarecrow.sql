CREATE TABLE "report_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" integer NOT NULL,
	"file_path" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "toilets" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" varchar(255) NOT NULL,
	"building" varchar(255) NOT NULL,
	"floor" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "report_files" ADD CONSTRAINT "report_files_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;