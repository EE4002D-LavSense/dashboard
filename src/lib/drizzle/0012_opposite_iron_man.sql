CREATE TABLE "node_to_toilet_id" (
	"node_id" varchar(255) PRIMARY KEY NOT NULL,
	"toilet_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "toilet_sensors" ALTER COLUMN "water_leak" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "toilet_sensors" ADD COLUMN "timestamp" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "node_to_toilet_id" ADD CONSTRAINT "node_to_toilet_id_toilet_id_toilets_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."toilets"("id") ON DELETE cascade ON UPDATE no action;