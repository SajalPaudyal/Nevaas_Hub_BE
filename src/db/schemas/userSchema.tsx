import {mysqlTable, int, varchar, boolean, timestamp} from "drizzle-orm/mysql-core"


export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    fullName: varchar("full_name", {length:100}).notNull(),
    email:varchar("email", {length:100}).notNull().unique(),
    password:varchar("password", {length:255}).notNull(),

    idDocumentPath:varchar("id_document_path", {length:512}).notNull(),
    isVerified:boolean("is_verified").default(false),

    createdAt: timestamp("created_at").defaultNow()
});