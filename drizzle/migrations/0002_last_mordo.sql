CREATE TABLE "fhir_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"resource_type" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transcription_summary" ALTER COLUMN "follow_up_needed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transcription_summary" ALTER COLUMN "human_review_needed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transcription_summary" ADD COLUMN "summary" text NOT NULL;