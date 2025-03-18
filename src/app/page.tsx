"use client";
import { DataTable } from "./data-table";
import {
    SummarizedContent,
    Transcription,
    FhirResources,
} from "@/interfaces/transcription";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TranscriptionSummaryClient from "@/../lib/api-clients/transcript-summary-client";
import { FhirDataDisplay } from "./fhir-display";
import React from "react";

export default function Home() {
    const [summarizedContents, setSummarizedContents] = React.useState(
        [] as SummarizedContent[]
    );
    const [transcriptionText, setTranscriptionText] = React.useState("");
    const [selectedFhirResource, setSelectedFhirResource] =
        React.useState<FhirResources>({} as FhirResources);
    const [validationError, setValidationError] = React.useState("");

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTranscriptionText(e.target.value);
    };

    async function generateTranscriptionSummary() {
        try {
            let transcription: Transcription;
            try {
                transcription = JSON.parse(transcriptionText);
                console.log(transcription);
            } catch (err) {
                setValidationError(
                    "Invalid JSON format. Please check your input"
                );
                console.log(err);
                return;
            }

            if (!transcription || typeof transcription != "object") {
                setValidationError("Invalid transcription format");
            }

            //Process transcripts
            await TranscriptionSummaryClient.processTranscription(
                transcription
            );

            //Update all transcripts
            const data =
                await TranscriptionSummaryClient.getAllSummarizedContents();
            setSummarizedContents(data);
        } catch (err) {
            console.log(err);
        }
    }
    // Handle row click and fetch FHIR resources
    const handleRowClick = async (id: string) => {
        const fhirData = await TranscriptionSummaryClient.getFhirResource(id);
        console.log(fhirData);
        setSelectedFhirResource(fhirData);
    };

    React.useEffect(() => {
        async function getAllTranscriptionSummaries() {
            try {
                const data =
                    await TranscriptionSummaryClient.getAllSummarizedContents();
                setSummarizedContents(data);
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        }
        getAllTranscriptionSummaries();
    }, []);
    return (
        <div>
            <div className="flex flex-col p-2 m-1 items-center">
                <div className="text-4xl font-semibold">
                    HealthCare Transcription IQ
                </div>
                <Textarea
                    placeholder="Transcription data in JSON format here..."
                    className="p-2 m-4 max-w-150 min-h-50 max-h-150"
                    onChange={(e) => {
                        handleTextChange(e);
                        setValidationError("");
                    }}
                    value={transcriptionText}
                ></Textarea>
                {validationError !== "" ? (
                    <div className="text-red-400 font-bold">{validationError}</div>
                ) : null}
                <div className="flex flex-row gap-2">
                    <Button
                        onClick={generateTranscriptionSummary}
                        variant="outline"
                    >
                        Summarize Transcript
                    </Button>
                </div>
                <div className="container mx-auto py-10">
                    <DataTable
                        columns={columns}
                        data={summarizedContents}
                        onRowClick={handleRowClick}
                    />
                </div>
                <FhirDataDisplay data={selectedFhirResource} />
            </div>
        </div>
    );
}
