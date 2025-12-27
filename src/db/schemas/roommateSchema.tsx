import {
  mysqlTable,
  varchar,
  int,
  boolean,
  decimal,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { users } from "./userSchema";

const genderValues = ["male", "female", "other"] as const;

export const educationEnums = mysqlEnum("educationEnum", [
  "high-school",
  "bachelor",
  "master",
  "phd",
  "undisclosable",
]);
export const facultyEnums = mysqlEnum("facultyEnum", [
  "science",
  "management",
  "humanities",
  "others",
]);

export const roommate = mysqlTable("roommate", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 300 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 255 }).notNull(),
  longitude: varchar("longitude", { length: 255 }).notNull(),

  beds: int("beds").notNull(),
  baths: int("baths").notNull(),

  occupation: varchar("occupation", { length: 255 }).notNull(),
  age: int("age").notNull(),
  gender: mysqlEnum("gender", genderValues).notNull(),
  faculty: facultyEnums.notNull(),
  education: educationEnums.notNull(),
  isSmoker: boolean("is_smoker").default(false),
  hasPets: boolean("had_pets").default(false),

  prefGender: mysqlEnum("pref_gender", genderValues).notNull().default("other"),
  prefMinAge: int("pref_min_age").default(18),
  prefMaxAge: int("pref_max_age").default(40),

  createdAt: timestamp("created_at").defaultNow(),
});
