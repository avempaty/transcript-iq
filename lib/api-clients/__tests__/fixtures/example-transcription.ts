import { Transcription } from "@/interfaces/transcription";

const exampleTranscription = {
    date: "2025-03-15T10:00:00Z",
    patient_id: "123456",
    conversation: [
        {
            timestamp: new Date("2025-03-15T10:00:00Z"),
            speaker: "AI",
            content: "Hello, how can I assist you today?",
        },
        {
            timestamp: new Date("2025-03-15T10:00:15Z"),
            speaker: "Patient",
            content: "Hi, I'm feeling a bit anxious lately.",
        },
        {
            timestamp: new Date("2025-03-15T10:00:30Z"),
            speaker: "AI",
            content:
                "I'm sorry to hear that. Can you tell me more about what you're feeling?",
        },
        {
            timestamp: new Date("2025-03-15T10:00:45Z"),
            speaker: "Patient",
            content:
                "I've been having trouble sleeping and can't seem to calm my mind.",
        },
        {
            timestamp: new Date("2025-03-15T10:01:00Z"),
            speaker: "AI",
            content:
                "It sounds like you're experiencing a lot of stress. Have you tried any relaxation techniques?",
        },
        {
            timestamp: new Date("2025-03-15T10:01:15Z"),
            speaker: "Patient",
            content: "I've tried meditation, but it doesn't seem to help much.",
        },
        {
            timestamp: new Date("2025-03-15T10:01:30Z"),
            speaker: "AI",
            content:
                "Meditation can sometimes take time to show its effects. Would you like me to guide you through a short relaxation exercise?",
        },
        {
            timestamp: new Date("2025-03-15T10:01:45Z"),
            speaker: "Patient",
            content: "Yes, that would be great.",
        },
    ],
} as Transcription;

export default exampleTranscription;