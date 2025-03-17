ALTER TABLE "transcription_summary" 
ALTER COLUMN "priority" 
SET DATA TYPE integer 
USING priority::integer;
