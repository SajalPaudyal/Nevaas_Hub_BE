import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const userTypeEnums = mysqlEnum("role", ["user", "admin"]);
export const statusEnums = mysqlEnum("status", [
  "accepted",
  "pending",
  "rejected",
]);

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 10 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  idDocumentPath: varchar("id_document_path", { length: 512 }).notNull(),
  role: userTypeEnums.default("user").notNull(),
  status: statusEnums.default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
