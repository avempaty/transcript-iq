import { db } from "@drizzle/db";
import { TranscriptionHealthCareSummaryTable } from "@drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const summarizedContent = await db
            .select()
            .from(TranscriptionHealthCareSummaryTable);

        if (summarizedContent.length === 0) {
            return NextResponse.json(
                { error: "Summarized Contents not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(summarizedContent, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to find Summarized content", details: err },
            { status: 500 }
        );
    }
}
