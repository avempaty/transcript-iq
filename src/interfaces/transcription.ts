export interface Message {
    timestamp: Date,
    speaker: "AI" | "Patient",
    content: string
}

export interface Transcription {
    date: Date,
    patient_id: string,
    conversation: Message[]
}

export interface SummarizedContent {
    patientId: number,
    summary: string,
    topics: string[],
    conditions: string[],
    followUpNeeded: string[],
    humanReviewNeeded: boolean,
    priority: 0 | 1 | 2,
}
