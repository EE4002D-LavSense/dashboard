ALTER TABLE "users" RENAME TO "admins";--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_email_unique" UNIQUE("email");