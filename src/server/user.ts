"use server";

import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

//GetUser
export async function GetUser() {
    const [users] = await db.select().from(user);
    return users;
}

//CreateUser
export async function CreateUser(username: string, bio: string, wallet_address: string, avatar: string) {
    const newUser = await db.insert(user).values({
        username: username.toLowerCase(),
        bio: bio,
        walletAddress: wallet_address,
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}`
    }).returning();
    return newUser;
}

//GetUserByWallet
export async function GetUserByWallet(wallet_address: string) {
    const [users] = await db.select().from(user).where(eq(user.walletAddress, wallet_address));
    return users;
}


//UpdateUser
export async function UpdateUser(id: string, username: string, bio: string) {
    const updatedUser = await db.update(user).set({
        username: username.toLowerCase(),
        bio: bio,
    }).where(eq(user.id, id)).returning();
    return updatedUser;
}
