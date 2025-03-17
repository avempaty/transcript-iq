"use client";
import { DataTable } from "./data-table";
import { SummarizedContent } from "@/interfaces/transcription";
import { columns } from "./columns";

const TestData: SummarizedContent[] = [
    {
        patientId: 12345,
        summary:
            "The patient expressed feelings of anxiety and trouble sleeping. The patient has tried meditation without much success. The AI offered to guide the patient through a relaxation exercise",
        topics: ["swelling", "naesea"],
        conditions: ["anxiety", "struggle"],
        followUpNeeded: ["yes psych follow up"],
        humanReviewNeeded: false,
        priority: 2,
    },
];
export default function Home() {
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={TestData} />
        </div>
    );
}
