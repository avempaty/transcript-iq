import APIClient from "@/../lib/api-clients/api-client";
import { Transcription, SummarizedContent } from "@/interfaces/transcription";

class TranscriptionSummaryClient extends APIClient {
    constructor() {
        super("/api");
    }
    //we will make a JSON transcription object that we can pass in here
    async processTranscription(transcription: Transcription) {
        const data: SummarizedContent = await this.jsonPost(
            "/summarize-transcription",
            transcription
        );
        console.log(data);
        return data;
    }
}

export default new TranscriptionSummaryClient();
