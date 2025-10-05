-- Fix the database schema to allow any string as user_id
-- This will solve the UUID constraint issue

-- Step 1: Remove the foreign key constraint
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_user_id_fkey";

-- Step 2: Change user_id column from UUID to TEXT
ALTER TABLE "User" ALTER COLUMN user_id TYPE TEXT;

-- Step 3: Update any foreign key references in other tables
-- Check if there are any other tables referencing User.user_id
-- and update them to use TEXT instead of UUID

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'user_id';
