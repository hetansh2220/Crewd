"use server"

import {db} from "@/db/index";
import {review} from "@/db/schema";

//GetReviews
export async function GetReviews() {
    const reviews = await db.select().from(review);
    return reviews;
}

//CreateReview
export async function CreateReview(reviewer: string, streamId: string, rating: number, comment: string) {
    const newReview = await db.insert(review).values({
        reviewer: reviewer,
        streamId: streamId,
        rating: rating,
        comment: comment,

    }).returning();
    return newReview;
}