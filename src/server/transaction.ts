"use server"

import { db } from "@/db/index";
import { transactions } from "@/db/schema";

//createtransaction
export async function createTransaction(data: {userId: string; groupId: string; transaction: string; amount: number;}) {
  const newTransaction = await db
    .insert(transactions)
    .values({
      userId: data.userId,
      groupId: data.groupId,
      transaction: data.transaction,
      amount: data.amount.toString(),
    })
    .returning();

  return newTransaction;
}