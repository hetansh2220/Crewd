"use server";

import { db } from "@/db/index";
import { group } from "@/db/schema";
import { eq } from "drizzle-orm";

//GetGroups
export async function GetGroups() {
    const groups = await db.select().from(group);
    return groups;
}

//CreateGroup
export async function CreateGroup(id: string, name: string, description: string, image: string, maxMembers: number, entryFee: number, owner: string,) {
    const newGroup = await db.insert(group).values({
        id: id,
        name: name,
        description: description,
        image: image,
        maxMembers: maxMembers,
        entryFee: entryFee,
        owner: owner,
    }).returning();
    return newGroup;
}

//GetGroupById

export async function GetGroupById(id: string) {
    const [groups] = await db.select().from(group).where(eq(group.id, id));
    return groups;
}