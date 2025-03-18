import TranscriptionSummaryClient from "../transcript-summary-client";
import { Message, Transcription } from "@/interfaces/transcription";

describe("TranscriptionSummaryClient Data Transformations", () => {
    describe("containsMedicalKeywords", () => {
        it("returns true if a message contains a medical keyword", () => {
            const conversation: Message[] = [
                { timestamp: new Date("2025-03-18T12:00:00Z"), speaker: "Patient", content: "I have pain in my knee" },
                { timestamp: new Date("2025-03-18T12:01:00Z"), speaker: "AI", content: "Can you describe the severity?" }
            ];

            expect(TranscriptionSummaryClient.containsMedicalKeywords(conversation)).toBe(true);
        });

        it("returns false if no messages contain medical keywords", () => {
            const conversation: Message[] = [
                { timestamp: new Date("2025-03-18T12:00:00Z"), speaker: "Patient", content: "I love hiking" },
                { timestamp: new Date("2025-03-18T12:01:00Z"), speaker: "AI", content: "That sounds fun!" }
            ];

            expect(TranscriptionSummaryClient.containsMedicalKeywords(conversation)).toBe(false);
        });
    });

    describe("isValidMessageArray", () => {
        it("returns true for a valid message array", () => {
            const validMessages: Message[] = [
                { timestamp: new Date("2025-03-18T12:00:00Z"), speaker: "Patient", content: "Hello, doctor." },
                { timestamp: new Date("2025-03-18T12:01:00Z"), speaker: "AI", content: "How are you feeling today?" }
            ];

            expect(TranscriptionSummaryClient.isValidMessageArray(validMessages)).toBe(true);
        });

        it("returns false for an invalid message array", () => {
            const invalidMessages = [
                { timestamp: "InvalidDate", speaker: "Patient", content: "This is wrong" },
                { speaker: "AI", content: "Missing timestamp" }
            ];

            expect(TranscriptionSummaryClient.isValidMessageArray(invalidMessages as Message[])).toBe(false);
        });
    });

    describe("isValidTranscription", () => {

        it("returns false for an invalid transcription", () => {
            const invalidTranscription = {
                date: 2025, // Should be a string
                patient_id: null, // Should be a string
                conversation: "This is not an array" // Should be an array
            };

            expect(TranscriptionSummaryClient.isValidTranscription(invalidTranscription as Transcription)).toBe(false);
        });
    });
});
