DROP INDEX "patient_idx";--> statement-breakpoint
ALTER TABLE "transcription_summary" ALTER COLUMN "follow_up_needed" DROP NOT NULL;