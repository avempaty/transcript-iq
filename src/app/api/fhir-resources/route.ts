import { db } from "@drizzle/db";
import { FhirResourceTable } from "@drizzle/schema";
import { NextResponse } from "next/server";
export async function GET() {
    try {
        const fhirResources = await db.select().from(FhirResourceTable);

        if (fhirResources.length === 0) {
            return NextResponse.json(
                { error: "Summarized Content not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(fhirResources, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to find Summarized content", details: err },
            { status: 500 }
        );
    }
}
