"use server"

import { db } from "@/db/index";
import { tips } from "@/db/schema";


//GetTips
export async function GetTips() {
    const tipsData = await db.select().from(tips);
    return tipsData;
}

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