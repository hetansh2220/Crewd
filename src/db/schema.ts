import stream from "@/lib/stream";
import { max } from "drizzle-orm";
import { integer, pgTable, varchar, uuid, text, timestamp} from "drizzle-orm/pg-core";

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
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 32 }).notNull().unique(),
  description: varchar({ length: 160 }).notNull(),
  image: text().notNull(),
  maxMembers: integer("max_members").notNull().default(10),
  entryFee: integer("entry_fee").notNull().default(0),
  owner: varchar("owner").notNull().references(() => user.walletAddress),
  streamId: varchar("stream_id").notNull().unique(),
  createdAt : timestamp("created_at").defaultNow().notNull(),
});

export type group = typeof group.$inferInsert

export const review = pgTable("reviews", {
  id: uuid().primaryKey().defaultRandom(),
  reviewer: varchar("reviewer").notNull().references(() => user.walletAddress), 
  streamId: uuid("stream_id").notNull().references(() => group.streamId), 
  rating: integer("rating").notNull(), 
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type review = typeof review.$inferInsert;