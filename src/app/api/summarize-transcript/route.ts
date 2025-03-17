import { db } from "@drizzle/db";
import { TranscriptionHealthCareSummaryTable } from "@drizzle/schema";
import OpenAIClient from "@/../lib/api-clients/openai-client";
import { NextRequest, NextResponse } from "next/server";
import {
    Message,
    Transcription,
    SummarizedContent,
} from "@/interfaces/transcription";
import BaseError from "@/../lib/base-error";
export async function POST(req: NextRequest) {
    let body: {
        conversation?: Message[];
    };
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json(
            { error: `body is not a json ${err}` },
            { status: 400 }
        );
    }

    try {
        const transcription = body as Transcription;
        const openAIresponse = await OpenAIClient.summarizeTranscription(
            transcription
        );
        const rawContent = openAIresponse.choices[0]?.message?.content;

        if (!rawContent) {
            return NextResponse.json(
                {
                    error: "Invalid OpenAI response: Missing content",
                },
                { status: 500 }
            );
        }

        const parsedContent: SummarizedContent = JSON.parse(rawContent);
        console.log(parsedContent);

        const summarizedContent = await db
            .insert(TranscriptionHealthCareSummaryTable)
            .values({
                patientId: Number(parsedContent.patientId),
                topics: parsedContent.topics,
                priority: parsedContent.priority,
                summary: parsedContent.summary,
                followUpNeeded: parsedContent.followUpNeeded,
                humanReviewNeeded: parsedContent.humanReviewNeeded,
                conditions: parsedContent.conditions,
            })
            .returning()
            .catch((err) => {
                console.log(err);
                throw BaseError.wrap(err, "failed to insert summarized content", {
                    parsedContent,
                    status: 500,
                });
            });

        return NextResponse.json(
            {
                summarizedContent,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating transcript summary", err);
        return NextResponse.json(
            {
                error:
                    err instanceof BaseError
                        ? err.message
                        : "Failed to create transcript summary",
            },
            { status: 500 }
        );
    }
}
