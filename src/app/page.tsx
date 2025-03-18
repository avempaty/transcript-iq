"use client";
import { DataTable } from "./data-table";
import { SummarizedContent } from "@/interfaces/transcription";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import TranscriptionSummaryClient from "@/../lib/api-clients/transcript-summary-client";
import React from "react";

export default function Home() {
    const [summarizedContents, setSummarizedContents] = React.useState(
        [] as SummarizedContent[]
    );

    React.useEffect(() => {
        async function getAllTranscriptionSummaries() {
            try {
                const data =
                    await TranscriptionSummaryClient.getAllSummarizedContents();
                    setSummarizedContents(data)
                    console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        getAllTranscriptionSummaries()
    }, []);
    return (
        <div className="flex flex-col p-2 m-1 items-center">
            <div className="text-4xl font-semibold">Transcription IQ</div>
            <div>
                <Button variant="outline">Generate New Transcript</Button>
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={summarizedContents} />
            </div>
        </div>
    );
}
