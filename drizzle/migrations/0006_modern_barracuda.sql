ALTER TABLE "transcription_summary" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "fhir_resources" ADD COLUMN "transcription_summary_id" uuid NOT NULL;