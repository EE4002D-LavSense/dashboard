CREATE TABLE "toilet_sensors" (
	"id" serial PRIMARY KEY NOT NULL,
	"toilet_id" integer NOT NULL,
	"cleanliness" integer,
	"occupancy" integer,
	"humidity" real,
	"water_leak" integer,
	"temperature" real
);
--> statement-breakpoint
ALTER TABLE "toilet_sensors" ADD CONSTRAINT "toilet_sensors_toilet_id_toilets_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."toilets"("id") ON DELETE cascade ON UPDATE no action;