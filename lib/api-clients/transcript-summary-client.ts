import APIClient from "./api-client";

interface Message {
    timestamp: Date,
    speaker: "AI" | "Patient",
    content: string
}

interface Transcription {
    conversation: Message[]
}

class TranscriptionSummaryClient extends APIClient {
    constructor() {
        super('/api')
    }
    //we will make a JSON transcription object that we can pass in here
    async processTranscription(text: string) {

    }
}