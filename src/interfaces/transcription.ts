export interface Message {
    timestamp: Date;
    speaker: "AI" | "Patient";
    content: string;
}

export interface Transcription {
    date: string;
    patient_id: string;
    conversation: Message[];
}

export interface SummarizedContent {
    id?: string;
    patientId: number;
    summary: string;
    topics: string[];
    conditions: string[];
    followUpNeeded: string[];
    humanReviewNeeded: boolean;
    priority: 0 | 1 | 2;
}

export interface FhirResources {
    id?: string;
    transcriptionSummaryId: string;
    patientId: number;
    resourceType: object[];
    createdAt: Date;
}

export const MEDICAL_KEYWORDS = [
    "pain",
    "swelling",
    "infection",
    "fever",
    "wound",
    "stitches",
    "medication",
    "recovery",
    "dressing",
    "suture",
    "mobility",
    "nausea",
    "vomiting",
    "surgery",
    "healing",
    "complications",
    "follow-up",
    "doctor",
    "nurse",
    "stress",
    "blood",
    "pressure",
    "headaches",
    "anxious",
];
