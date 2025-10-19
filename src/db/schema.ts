import stream from "@/lib/stream";
import { max } from "drizzle-orm";
import { integer, pgTable, varchar, uuid, text, timestamp} from "drizzle-orm/pg-core";
import { id } from "zod/v4/locales";

export const user = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 12 }).notNull().unique(),
  bio: varchar({ length: 160 }).notNull(),
  walletAddress: varchar("wallet_address").unique(),
  avatar: text().notNull(),
  createdAt : timestamp("created_at").defaultNow().notNull(),
});

export type user = typeof user.$inferInsert

export const group = pgTable("groups", {
  id: uuid().primaryKey(),
  name: varchar({ length: 32 }).notNull().unique(),
  description: varchar({ length: 160 }).notNull(),
  image: text().notNull(),
  maxMembers: integer("max_members").notNull().default(10),
  entryFee: integer("entry_fee").notNull().default(0),
  owner: varchar("owner").notNull().references(() => user.walletAddress),
  createdAt : timestamp("created_at").defaultNow().notNull(),
});

export type group = typeof group.$inferInsert

export const review = pgTable("reviews", {
  id: uuid().primaryKey().defaultRandom(),
  reviewer: varchar("reviewer").notNull().references(() => user.walletAddress), 
  groupId: uuid("group_id").notNull().references(() => group.id), 
  rating: integer("rating").notNull(), 
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type review = typeof review.$inferInsert;

export const tips = pgTable("tips", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => user.walletAddress),
  groupId: uuid("group_id").notNull().references(() => group.id),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type tips = typeof tips.$inferInsert;

export const transactions = pgTable("transactions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => user.walletAddress),
  groupId: uuid("group_id").notNull().references(() => group.id),
  transaction: text("transaction").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type transactions = typeof transactions.$inferInsert;