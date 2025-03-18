import { Transcription } from "@/interfaces/transcription";

const exampleTranscription3 = {
    date: new Date("2025-03-16T14:30:00Z"),
    patient_id: "789012",
    conversation: [
        {
            timestamp: new Date("2025-03-16T14:30:00Z"),
            speaker: "AI",
            content: "Hello, how are you feeling today?",
        },
        {
            timestamp: new Date("2025-03-16T14:30:15Z"),
            speaker: "Patient",
            content: "I've been experiencing a lot of back pain recently.",
        },
        {
            timestamp: new Date("2025-03-16T14:30:30Z"),
            speaker: "AI",
            content: "I'm sorry to hear that. When did the pain start?",
        },
        {
            timestamp: new Date("2025-03-16T14:30:45Z"),
            speaker: "Patient",
            content: "It’s been about two weeks now. It gets worse when I sit for too long.",
        },
        {
            timestamp: new Date("2025-03-16T14:31:00Z"),
            speaker: "AI",
            content: "That sounds uncomfortable. Have you tried any stretches or posture adjustments?",
        },
        {
            timestamp: new Date("2025-03-16T14:31:15Z"),
            speaker: "Patient",
            content: "Not really. What do you recommend?",
        },
        {
            timestamp: new Date("2025-03-16T14:31:30Z"),
            speaker: "AI",
            content: "I can guide you through some gentle stretches that may help. Would you like to try?",
        },
        {
            timestamp: new Date("2025-03-16T14:31:45Z"),
            speaker: "Patient",
            content: "Yes, that would be helpful.",
        },
    ],
} as Transcription;

export default exampleTranscription3;
