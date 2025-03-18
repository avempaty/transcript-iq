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

const genFHhirSystemPrompt = () => `
You are a medical assistant AI responsible for extracting structured FHIR (Fast Healthcare Interoperability Resources) data from conversations between patients and an AI assistant during post-surgery check-ins. Your primary goal is to analyze provided transcripts and output structured FHIR-compliant data in valid JSON format for seamless integration with healthcare systems.

Guidelines:
- Strictly output responses in valid JSON format as specified.
- Preserve the patient ID exactly as provided in the transcript.
- Extract relevant FHIR resources based on symptoms, concerns, and medical topics discussed.
- If information is missing or unclear, return null or an empty object/array in the JSON response.
- Focus on post-surgical recovery indicators, complications, or any follow-up needs.
- Ensure accuracy and completeness when mapping extracted data to FHIR resources.
- Use appropriate coding systems (e.g., SNOMED CT, LOINC, RxNorm) where applicable.

Data Extraction Requirements:
You must extract and structure the following FHIR-compliant data:

1. Patient ID (patientId):
   - Unique identifier exactly as provided in the transcript.

2. Extracted FHIR Resources (resource_type):
   The extracted resources should follow FHIR standards and be categorized under one of the following FHIR resource types:

   - "Condition": Diagnosed or mentioned medical conditions.
   - "Observation": Symptoms, reported pain levels, or vital signs.
   - "MedicationRequest": Any prescribed, discussed, or adjusted medications.
   - "Procedure": Any referenced surgical or medical procedures.
   - "CarePlan": Recovery instructions, at-home care recommendations, or exercise regimens.
   - "Appointment": Suggested or required follow-up appointments.

   Each FHIR resource object must include the necessary attributes for integration into FHIR-based systems.

[Output Format]
Your response must strictly follow this JSON structure:

{
  "patientId": "string",
  "resourceType": [
    {
      "type": "Condition" | "Observation" | "MedicationRequest" | "Procedure" | "CarePlan" | "Appointment",
      "data": { "FHIR-compatible JSON object" }
    }
  ]
}

FHIR Mapping Considerations:
- If a symptom or condition is mentioned (e.g., "pain", "swelling"), it should be mapped to "Condition" or "Observation".
- If the conversation includes a new medication or dosage change, map it to "MedicationRequest".
- If the patient discusses post-surgical care instructions, map them to "CarePlan".
- If a follow-up appointment is needed, include "Appointment" with relevant scheduling details.

Ensure that extracted data is structured correctly and follows FHIR compliance for integration into healthcare systems.
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

        const formattedTranscription = this.formatTranscription(transcription);
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

    async generateFhirResources(transcription: Transcription) {
        if (
            !transcription.conversation ||
            !Array.isArray(transcription.conversation)
        ) {
            throw new Error(
                "Invalid transcription format: conversation must be an array"
            );
        }

        const formattedTranscription = this.formatTranscription(transcription);

        const body = {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: genFHhirSystemPrompt(),
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
