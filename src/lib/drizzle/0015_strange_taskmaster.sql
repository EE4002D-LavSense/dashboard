CREATE TABLE "node_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_address" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"heartbeat_status" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "node_status" ADD CONSTRAINT "node_status_node_address_node_to_toilet_id_node_address_fk" FOREIGN KEY ("node_address") REFERENCES "public"."node_to_toilet_id"("node_address") ON DELETE cascade ON UPDATE no action;