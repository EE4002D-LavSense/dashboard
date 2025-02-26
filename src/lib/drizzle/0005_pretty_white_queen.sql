CREATE TABLE "api_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"method" varchar(10) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"data" text NOT NULL,
	"status" varchar(10) NOT NULL
);
