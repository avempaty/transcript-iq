CREATE TABLE "transcriptionSummary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" integer NOT NULL,
	"topics" text[] NOT NULL,
	"conditions" text[] NOT NULL,
	"follow_up_needed" boolean,
	"human_review_needed" boolean,
	"priority" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "patient_idx" ON "transcriptionSummary" USING btree ("patient_id");