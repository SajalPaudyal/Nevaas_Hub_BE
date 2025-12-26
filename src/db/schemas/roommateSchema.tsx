import {
  mysqlTable,
  varchar,
  int,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { properties } from "./propertiesSchema";

export const genderEnums = mysqlEnum("genderEnums", [
  "male",
  "female",
  "other",
]);
export const educationEnums = mysqlEnum("educationEnum", [
  "High School",
  "Bachelor",
  "Master",
  "PhD",
  "undisclosable",
]);
export const facultyEnums = mysqlEnum("facultyEnum", [
  "Science",
  "Management",
  "Humanities",
  "Others",
]);

export const roommate = mysqlTable("roommate", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  occupation: varchar("occupation", { length: 100 }).notNull(),
  age: int("age").notNull(),
  gender: genderEnums.notNull(),
  faculty: facultyEnums.notNull(),
  education:educationEnums.notNull(),
  isSmoker: boolean("is_smoker").default(false),
  hasPets: boolean("has_pets").default(false),


  prefGender: genderEnums.default("other"),
  prefMinAge: int("pref_min_age").default(18),
  prefMaxAge: int("pref_max_age").default(40),
});
