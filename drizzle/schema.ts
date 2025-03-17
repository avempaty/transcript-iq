import {
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    integer,
    boolean,
    jsonb,
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
        followUpNeeded: text("follow_up_needed").array().notNull(),
        humanReviewNeeded: boolean("human_review_needed").notNull(),
        priority: integer("priority").notNull(),
    },
    (transcriptionSummary) => {
        return {
            patientIdx: uniqueIndex("patient_idx").on(
                transcriptionSummary.patientId
            ),
        };
    }
);

export const fhirResources = pgTable(
    "fhir_resources",
    {
        id: serial("id").primaryKey(),
        patientId: integer("patient_id").notNull(),
        resourceType: jsonb("resource_type").notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
);
