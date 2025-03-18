import { Transcription } from "@/interfaces/transcription";

const exampleTranscription4 = {
    date: new Date("2025-03-18T16:20:00Z"),
    patient_id: "987654",
    conversation: [
        {
            timestamp: new Date("2025-03-18T16:20:00Z"),
            speaker: "AI",
            content: "Hello, how has your treatment been going?",
        },
        {
            timestamp: new Date("2025-03-18T16:20:15Z"),
            speaker: "Patient",
            content: "I just started a new medication, but it's making me feel really tired.",
        },
        {
            timestamp: new Date("2025-03-18T16:20:30Z"),
            speaker: "AI",
            content: "Fatigue can sometimes be a side effect. When did you start taking it?",
        },
        {
            timestamp: new Date("2025-03-18T16:20:45Z"),
            speaker: "Patient",
            content: "Three days ago. I feel exhausted even after sleeping well.",
        },
        {
            timestamp: new Date("2025-03-18T16:21:00Z"),
            speaker: "AI",
            content: "Have you noticed any other side effects?",
        },
        {
            timestamp: new Date("2025-03-18T16:21:15Z"),
            speaker: "Patient",
            content: "Not really, just the tiredness.",
        },
        {
            timestamp: new Date("2025-03-18T16:21:30Z"),
            speaker: "AI",
            content: "I recommend discussing this with your doctor. In the meantime, would you like some tips to manage fatigue?",
        },
        {
            timestamp: new Date("2025-03-18T16:21:45Z"),
            speaker: "Patient",
            content: "Yes, that would be helpful.",
        },
    ],
} as Transcription;

export default exampleTranscription4;
