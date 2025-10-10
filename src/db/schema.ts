import { integer, pgTable, varchar, uuid, text } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 12 }).notNull().unique(),
  bio: varchar({ length: 160 }).notNull(),
  walletAddress: varchar("wallet_address").unique(),
  avatar: text().notNull()
});
 
export type user = typeof user.$inferInsert