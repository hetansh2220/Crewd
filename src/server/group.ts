"use server";

import { db } from "@/db/index";
import { group } from "@/db/schema";

//GetGroups
export async function GetGroups() {
    const groups = await db.select().from(group);
    return groups;
}

//CreateGroup
export async function CreateGroup(name: string, description: string, image: string, maxMembers: number, entryFee: number, owner: string, streamId: string) {
    const newGroup = await db.insert(group).values({
        name: name,
        description: description,
        image: image,
        maxMembers: maxMembers,
        entryFee: entryFee,
        owner: owner,
        streamId: streamId
    }).returning();
    return newGroup;
}

