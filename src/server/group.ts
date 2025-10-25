"use server";

import { db } from "@/db/index";
import { group } from "@/db/schema";
import { eq } from "drizzle-orm";
import { group as groupType } from "@/db/schema";

//GetGroups
export async function GetGroups() {
    const groups = await db.select().from(group);
    return groups;
}

//CreateGroup
export async function CreateGroup(params: groupType) {
    const newGroup = await db.insert(group).values(params).returning();
    return newGroup;
}

//GetGroupById
export async function GetGroupById(id: string) {
    const [groups] = await db.select().from(group).where(eq(group.id, id));
    return groups;
}