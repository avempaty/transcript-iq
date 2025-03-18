import { db } from "@drizzle/db";
import { FhirResourceTable } from "@drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export async function GET(
    request: Request,
    { params }: { params: { id: string } } // The destructured context with params
) {
    try {
        const conversationId = await params.id;
        const fhirResource = await db
            .select()
            .from(FhirResourceTable)
            .where(eq(FhirResourceTable.transcriptionSummaryId, conversationId))
            .limit(1);
        if (fhirResource.length === 0) {
            return NextResponse.json(
                { error: "Summarized Content not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(fhirResource[0], { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to find Summarized content", details: err },
            { status: 500 }
        );
    }
}
