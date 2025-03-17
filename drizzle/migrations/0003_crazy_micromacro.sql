-- Step 1: Add a new column with the correct type
ALTER TABLE "transcription_summary" ADD COLUMN "follow_up_needed_new" TEXT[];

-- Step 2: Migrate existing boolean values into meaningful text arrays
UPDATE "transcription_summary"
SET "follow_up_needed_new" = 
    CASE 
        WHEN follow_up_needed = TRUE THEN ARRAY['Follow-up required']
        ELSE ARRAY['No follow-up needed']
    END;

-- Step 3: Drop the old boolean column
ALTER TABLE "transcription_summary" DROP COLUMN "follow_up_needed";

-- Step 4: Rename the new column to match the original name
ALTER TABLE "transcription_summary" RENAME COLUMN "follow_up_needed_new" TO "follow_up_needed";
