import { drizzle } from 'drizzle-orm/neon-http';
if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("NEXT_PUBLIC_DATABASE_URL is not set in environment variables");
}
export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL);