import { db } from "@drizzle/db";
import {
    FhirResourceTable,
    TranscriptionHealthCareSummaryTable,
} from "@drizzle/schema";
import OpenAIClient from "@/../lib/api-clients/openai-client";
import { NextRequest, NextResponse } from "next/server";
import {
    Message,
    Transcription,
    SummarizedContent,
    FhirResources,
    MEDICAL_KEYWORDS,
} from "@/interfaces/transcription";
import BaseError from "@/../lib/base-error";
export async function POST(req: NextRequest) {
    let body: {
        date: string;
        patient_id: string;
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

    if (!isValidTranscription(body as Transcription)) {
        return NextResponse.json(
            {
                error: "Invalud or irrelvant transcription. Please ensure its a post-surgery check-in conversation",
            },
            { status: 400 }
        );
    }

    try {
        const transcription = body as Transcription;
        console.log(transcription);
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

        if (
            parsedContent.patientId == null ||
            parsedContent.topics == null ||
            parsedContent.summary == null ||
            parsedContent.conditions == null
        ) {
            return NextResponse.json(
                {
                    error: "Please send more specific transcript, couldn't collect all information",
                },
                {
                    status: 500,
                }
            );
        }

        const [summarizedContent] = await db
            .insert(TranscriptionHealthCareSummaryTable)
            .values({
                patientId: Number(parsedContent.patientId),
                date: new Date(transcription.date),
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
                throw BaseError.wrap(
                    err,
                    "failed to insert summarized content",
                    {
                        parsedContent,
                        status: 500,
                    }
                );
            });

        const summarizedContentId = summarizedContent.id;

        //Second OpenAPI Call for FHIR Resources
        const OpenAIFhirResponse = await OpenAIClient.generateFhirResources(
            transcription
        );
        const rawFhirContent = OpenAIFhirResponse.choices[0]?.message?.content;

        if (!rawFhirContent) {
            return NextResponse.json(
                {
                    error: "Invalid OpenAI response: Missing content",
                },
                { status: 500 }
            );
        }

        const parsedFhirContent: FhirResources = JSON.parse(rawFhirContent);
        console.log(parsedFhirContent);
        await db
            .insert(FhirResourceTable)
            .values({
                patientId: Number(parsedContent.patientId),
                transcriptionSummaryId: summarizedContent.id,
                createdAt: new Date(),
                resourceType: parsedFhirContent.resourceType,
            })
            .returning()
            .catch((err) => {
                console.log(err);
                throw BaseError.wrap(
                    err,
                    "failed to insert into fhir resources",
                    {
                        parsedFhirContent,
                        status: 500,
                    }
                );
            });

        return NextResponse.json(
            {
                summarizedContentId,
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

function containsMedicalKeywords(conversation: Message[]): boolean {
    return conversation.some((msg) =>
        MEDICAL_KEYWORDS.some((keyword) =>
            msg.content.toLowerCase().includes(keyword)
        )
    );
}

function isValidMessageArray(data: Message[]): boolean {
    return (
        Array.isArray(data) &&
        data.every(
            (msg) =>
                typeof msg === "object" &&
                msg.timestamp &&
                !isNaN(new Date(msg.timestamp).getTime()) &&
                (msg.speaker === "AI" || msg.speaker === "Patient") &&
                typeof msg.content === "string"
        )
    );
}

function isValidTranscription(data: Transcription): boolean {
    return (
        data &&
        typeof data === "object" &&
        typeof data.date === "string" &&
        typeof data.patient_id === "string" &&
        isValidMessageArray(data.conversation) &&
        containsMedicalKeywords(data.conversation)
    );
}
