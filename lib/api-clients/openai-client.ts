import APIClient from "./api-client";
import { Transcription } from "@/interfaces/transcription";

const genSystemPrompt = () => `
You are a medical assistant AI responsible for extracting structured medical data from conversations between patients and an AI assistant during post-surgery check-ins. 
Your task is to analyze provided transcripts and clearly extract specific structured information that could be integrated with FHIR (Fast Healthcare Interoperability Resources) systems.

Always adhere strictly to these guidelines:
- Output responses exclusively in valid JSON format as specified.
- If certain requested information is unclear or missing from the transcript, explicitly indicate this in your JSON output (e.g., empty arrays or null values).
- Always write your response in English with a professional and concise tone.
- Ensure the patient ID is accurately preserved from the transcript.
- Pay special attention to post-surgical recovery indicators, complications, or concerns.

The structured data you must extract includes:
- Patient ID: Identifier of the patient exactly as provided in the transcript.
- Summary: Brief summary (1-2 sentences) highlighting key points of the conversation.
- Conditions Mentioned: List of medical conditions or symptoms explicitly mentioned (e.g., "pain", "swelling", "fever").
- Topics Discussed: List of main topics covered during the conversation (e.g., "medication adherence", "wound care", "mobility").
- Follow-ups Needed: List of actionable follow-up steps required (e.g., "schedule a call", "adjust medication").
- Human Review Needed: Boolean indicating if human intervention is required.
- Human Review Justification: Brief explanation of why human review is needed (only if humanReviewNeeded is true).
- Priority: Urgency level indicating how quickly follow-up is needed (0: high, 1: medium, or 2: low).
- FHIR Resource Types: List of relevant FHIR resource types that this information could map to (e.g., "Condition", "Observation", "CarePlan").

Priority guidelines:
- 0: Immediate attention needed (24 hours or less) - severe symptoms, distress, or safety concerns
- 1: Follow-up within 2-3 days - moderate symptoms or concerns
- 2: Routine follow-up (within 1-2 weeks) - minor issues or general check-in

[Output Format]

{
  "patientId": string,
  "date": Date,
  "summary": string,
  "conditions": string[],
  "topics": string[],
  "followUpNeeded": string[],
  "humanReviewNeeded": boolean,
  "priority": 0 | 1 | 2
}
`;

const genUserPrompt = (formattedTranscription: string) => `
[Transcript]

${formattedTranscription}`;

class OpenAIClient extends APIClient {
    constructor(apiKey: string) {
        super("https://api.openai.com/v1/chat/completions", apiKey);
    }

    formatTranscription(transcription: Transcription): string {
        const transcriptionHeaderString = `Patient ID: ${
            transcription.patient_id
        }\nDate: ${new Date(transcription.date).toISOString()}`;

        const conversationString = transcription.conversation
            .map((msg) => {
                const timestamp = new Date(msg.timestamp).toISOString();
                return `[${timestamp}] ${msg.speaker}: ${msg.content}`;
            })
            .reduce((memo, item) => {
                return `${memo}\n${item}`;
            }, "");

        return `${transcriptionHeaderString}\n\n${conversationString}`;
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

        const formattedTranscription = await this.formatTranscription(
            transcription
        );
        //console.log(formattedTranscription)

        const body = {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: genSystemPrompt(),
                },
                {
                    role: "user",
                    content: genUserPrompt(formattedTranscription),
                },
            ],
        };
        return this.jsonPost("", body);
    }
}

export default new OpenAIClient(process.env.OPENAI_API_KEY!);
