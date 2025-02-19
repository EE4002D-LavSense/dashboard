import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const toiletsTable = pgTable("toilets", {
  // name of the toilet could be building-floor-type
  // e.g. E2-1-MALE
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  location: varchar("location", { length: 255 }),
  building: varchar("building", { length: 255 }).notNull(),
  floor: varchar("floor", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(), // gender or type of toilet
});

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  location: varchar("location", { length: 255 }).notNull(), // Toilet location
  description: text("description").notNull(), // Problem description
  remarks: text("remarks"), // Additional remarks (optional)
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp of report submission
});

export const reportFilesTable = pgTable("report_files", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reportsTable.id, { onDelete: "cascade" })
    .notNull(),
  filePath: varchar("file_path", { length: 255 }).notNull(), // Store file path or URL
});
