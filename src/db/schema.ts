import { max } from "drizzle-orm";
import { integer, pgTable, varchar, uuid, text } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 12 }).notNull().unique(),
  bio: varchar({ length: 160 }).notNull(),
  walletAddress: varchar("wallet_address").unique(),
  avatar: text().notNull()
});

export type user = typeof user.$inferInsert

export const group = pgTable("groups", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 32 }).notNull().unique(),
  description: varchar({ length: 160 }).notNull(),
  image: text().notNull(),
  maxMembers: integer("max_members").notNull().default(10),
  entryFee: integer("entry_fee").notNull().default(0),
  owner: varchar("owner").notNull().references(() => user.walletAddress)
});

export type group = typeof group.$inferInsert