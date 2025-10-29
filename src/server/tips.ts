"use server"

import { db } from "@/db/index";
import { tips } from "@/db/schema";
import { eq } from "drizzle-orm";

//CreateTip
export async function CreateTip(userId: string, groupId: string, amount: number, transaction: string) {
    const newTip = await db.insert(tips).values({
        userId: userId,
        groupId: groupId,
        amount: amount.toString(),
        transaction: transaction,
    }).returning();
    return newTip;
}

//GetTipByGroupId
export async function GetTipByGroupId(groupId: string) {
    const tipData = await db.select().from(tips).where(eq(tips.groupId, groupId));
    return tipData;
}