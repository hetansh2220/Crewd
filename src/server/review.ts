"use server"

import { db } from "@/db/index";
import { review } from "@/db/schema";
import { avg, eq } from "drizzle-orm";

//GetReviewsByGroupId
export async function GetReviewsByGroupId(groupId: string) {
    const reviews = await db.select().from(review).where(eq(review.groupId, groupId));
    return reviews;
}

//CreateReview
export async function CreateReview(reviewer: string, groupId: string, rating: number, comment: string) {
    const newReview = await db.insert(review).values({
        reviewer: reviewer,
        groupId: groupId,
        rating: rating,
        comment: comment,
    }).returning();
    return newReview;
}

export async function getAverageRating(groupId: string) {
    const [result] = await db
        .select({
            averageRating: avg(review.rating),
        })
        .from(review)
        .where(eq(review.groupId, groupId));
    return result;
}   