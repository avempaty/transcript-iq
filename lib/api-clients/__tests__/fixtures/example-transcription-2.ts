import { Transcription } from "@/interfaces/transcription";

const exampleTranscription2 = {
    date: "2025-03-17T09:45:00Z",
    patient_id: "456789",
    conversation: [
        {
            timestamp: new Date("2025-03-17T09:45:00Z"),
            speaker: "AI",
            content: "Good morning. How can I assist you today?",
        },
        {
            timestamp: new Date("2025-03-17T09:45:15Z"),
            speaker: "Patient",
            content: "I've been monitoring my blood pressure, and it's been high lately.",
        },
        {
            timestamp: new Date("2025-03-17T09:45:30Z"),
            speaker: "AI",
            content: "I see. Have you been experiencing any symptoms like dizziness or headaches?",
        },
        {
            timestamp: new Date("2025-03-17T09:45:45Z"),
            speaker: "Patient",
            content: "Yes, I've had headaches in the mornings.",
        },
        {
            timestamp: new Date("2025-03-17T09:46:00Z"),
            speaker: "AI",
            content: "That can be concerning. Have you made any recent changes in diet or medication?",
        },
        {
            timestamp: new Date("2025-03-17T09:46:15Z"),
            speaker: "Patient",
            content: "Not really, but I have been under a lot of stress at work.",
        },
        {
            timestamp: new Date("2025-03-17T09:46:30Z"),
            speaker: "AI",
            content: "Stress can affect blood pressure. Would you like me to provide some stress management tips?",
        },
        {
            timestamp: new Date("2025-03-17T09:46:45Z"),
            speaker: "Patient",
            content: "Yes, that would be great.",
        },
    ],
} as Transcription;

export default exampleTranscription2;
