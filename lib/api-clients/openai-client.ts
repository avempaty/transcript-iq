import APIClient from "./api-client";
import { Transcription } from "@/interfaces/transcription";

class OpenAIClient extends APIClient {
    constructor(apiKey: string) {
        super("https://api.openai.com/v1/chat/completions", apiKey);
    }

    async summarizeTranscription(transcription: Transcription) {
        if (
            !transcription.conversation ||
            !Array.isArray(transcription.conversation)
        ) {
            throw new Error(
                "Invalid transcription format: conversation must be an array"
            );
        }

        const formattedConversation = transcription.conversation.map((msg) => {
            const timestamp = new Date(msg.timestamp).toISOString();
            return `[${timestamp}] ${msg.speaker}: ${msg.content}`;
        });

        const body = {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a medical assistant AI that summarizes patient conversations into structured insights for healthcare professionals",
                },
                {
                    role: "user",
                    content: `Here is a conversation transcript between a patient and an AI assistant:\n\n${formattedConversation}\n\n
                    Extract the following structured data:
                    - Patient ID as a number
                    - Small summary of patient and medical assistant AI conversation
                    - Conditions mentioned (e.g., pain, swelling, fever).
                    - Topics discussed (e.g., medication adherence, wound care, mobility).
                    - Follow-ups needed (e.g., schedule a call, adjust medication).
                    - Flagging for human review (e.g., signs of complications requiring immediate attention).
                    - Priority (high/medium/low) to indicate how fast we need to follow up

                    Provide a JSON response in the following format:
                    {
                        "patient": PatientId
                        "summary": string summary of conversation
                        "conditions": ["condition1", "condition2"],
                        "topics": ["topic1", "topic2"],
                        "followUps": ["follow-up1", "follow-up2"],
                        "humanReviewNeeded": true/false,
                        "priority" "high" | "medium" | "low"
                    }`,
                },
            ],
        };
        return this.jsonPost("", body);
    }
}

export default new OpenAIClient(process.env.OPENAI_API_KEY!);
