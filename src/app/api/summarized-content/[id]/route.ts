import { db } from "@drizzle/db";
import { TranscriptionHealthCareSummaryTable } from "@drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export async function GET(
    request: Request,
    { params }: { params: { id: string } } // The destructured context with params
) {
    try {
        const conversationId = params.id;
        const summarizedContent = await db
            .select()
            .from(TranscriptionHealthCareSummaryTable)
            .where(eq(TranscriptionHealthCareSummaryTable.id, conversationId))
            .limit(1);
        if (summarizedContent.length === 0) {
            return NextResponse.json(
                { error: "Summarized Content not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(summarizedContent[0], { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to find Summarized content", details: err },
            { status: 500 }
        );
    }
}
