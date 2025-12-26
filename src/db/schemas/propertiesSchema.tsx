import {
  mysqlTable,
  varchar,
  decimal,
  int,
  mysqlEnum,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./userSchema";
import { roommate } from "./roommateSchema";

export const propertyTypeEnums = mysqlEnum("property_type", [
  "apartment",
  "flat",
  "room",
  "house",
]);

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 300 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  beds: int("beds").notNull(),
  baths: int("baths").notNull(),
  type: propertyTypeEnums.notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  badge: varchar("badge", { length: 50 }),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),

  isRoommateOption: boolean("is_roommate_option").default(false),
});

export const propertiesRelations = relations(properties, ({ one }) => ({
  roommateDetails: one(roommate, {
    fields: [properties.id],
    references: [roommate.propertyId],
  }),
}));
