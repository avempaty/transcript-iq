import {
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
    index,
    uuid,
    integer,
    boolean,
} from "drizzle-orm/pg-core";

// Define the table structure using the newer API.
export const TranscriptionHealthCareSummaryTable = pgTable(
    "transcription_summary",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        patientId: integer("patient_id").notNull(),
        summary: text("summary").notNull(),
        topics: text("topics").array().notNull(),
        conditions: text("conditions").array().notNull(),
        followUpNeeded: boolean("follow_up_needed").notNull(),
        humanReviewNeeded: boolean("human_review_needed").notNull(),
        priority: text("priority").notNull(),
    },
    (transcriptionSummary) => {
        return {
            patientIdx: uniqueIndex("patient_idx").on(
                transcriptionSummary.patientId
            ),
        };
    }
);
