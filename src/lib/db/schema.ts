import {
  integer,
  real,
  boolean,
  pgTable,
  varchar,
  text,
  timestamp,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "resolved",
]);

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  first_name: varchar("first_name", { length: 255 }),
  last_name: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: rolesEnum().default("user"),
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
  status: reportStatusEnum().default("pending").notNull(), // Status of report
});

export const reportFilesTable = pgTable("report_files", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reportsTable.id, { onDelete: "cascade" })
    .notNull(),
  filePath: varchar("file_path", { length: 255 }).notNull(), // Store file path or URL
});

export const apiLogsTable = pgTable("api_logs", {
  id: serial("id").primaryKey(),
  method: varchar("method", { length: 10 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  data: text("data").notNull(),
  status: varchar("status", { length: 10 }).notNull(),
});

export const toiletSensorsTable = pgTable("toilet_sensors", {
  id: serial("id").primaryKey(),
  toiletId: integer("toilet_id")
    .references(() => toiletsTable.id, { onDelete: "cascade" })
    .notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  cleanliness: integer("cleanliness"),
  occupancy: integer("occupancy"),
  humidity: real("humidity"),
  waterLeak: boolean("water_leak"),
  temperature: real("temperature"),
});

export const nodeToToiletIdTable = pgTable("node_to_toilet_id", {
  nodeId: varchar("node_id", { length: 255 }).primaryKey(),
  toiletId: integer("toilet_id")
    .references(() => toiletsTable.id, { onDelete: "cascade" })
    .notNull(),
});
