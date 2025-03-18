import APIClient from "@/../lib/api-clients/api-client";
import {
    Transcription,
    SummarizedContent,
    Message,
    MEDICAL_KEYWORDS,
} from "@/interfaces/transcription";

class TranscriptionSummaryClient extends APIClient {
    constructor() {
        super("/api");
    }
    //we will make a JSON transcription object that we can pass in here
    async processTranscription(transcription: Transcription) {
        if (!this.isValidTranscription(transcription)) {
            throw new Error(
                "Invalid or irrelevant transcription. Ensure it's a post-surgery check-in conversation."
            );
        }

        const data = await this.jsonPost(
            "/summarize-transcription",
            transcription
        );

        console.log(data);
        return data;
    }

    async getAllSummarizedContents() {
        console.log(this.host);
        const allSummarizedContents: SummarizedContent[] = await this.jsonFetch(
            "/summarized-content"
        );
        return allSummarizedContents;
    }

    async getSummarizedContent(id: string) {
        const summarizedContent: SummarizedContent = await this.jsonFetch(
            `/summarized-content/${id}`
        );
        return summarizedContent;
    }

    containsMedicalKeywords(conversation: Message[]): boolean {
        return conversation.some((msg) =>
            MEDICAL_KEYWORDS.some((keyword) =>
                msg.content.toLowerCase().includes(keyword)
            )
        );
    }

    isValidMessageArray(data: Message[]): boolean {
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

    isValidTranscription(data: Transcription): boolean {
        return (
            data &&
            typeof data === "object" &&
            typeof data.date === "string" &&
            typeof data.patient_id === "string" &&
            this.isValidMessageArray(data.conversation) &&
            this.containsMedicalKeywords(data.conversation)
        );
    }
}

export default new TranscriptionSummaryClient();
