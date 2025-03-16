export interface Message {
    timestamp: Date,
    speaker: "AI" | "Patient",
    content: string
}

export interface Transcription {
    conversation: Message[]
}

export interface SummarizedContent {
    patientId: string,
    summary: string,
    topics: string[],
    conditions: string[],
    followUpNeeded: string[],
    humanReviewNeeded: boolean,
    priority: "low" | "medium" | "high",
}
