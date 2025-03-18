import { pgTable, serial, integer, jsonb, timestamp, uniqueIndex, uuid, text, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const fhirResources = pgTable("fhir_resources", {
	id: serial().primaryKey().notNull(),
	patientId: integer("patient_id").notNull(),
	resourceType: jsonb("resource_type").array().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const transcriptionSummary = pgTable("transcription_summary", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	patientId: integer("patient_id").notNull(),
	topics: text().array().notNull(),
	conditions: text().array().notNull(),
	humanReviewNeeded: boolean("human_review_needed").notNull(),
	priority: integer().notNull(),
	summary: text().notNull(),
	followUpNeeded: text("follow_up_needed").array(),
}, (table) => [
	uniqueIndex("patient_idx").using("btree", table.patientId.asc().nullsLast().op("int4_ops")),
]);
