import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

// Environment variables with fallbacks
const SUPABASE_URL = process.env['SUPABASE_URL'] || 'https://lmookidxihtttfzodbvf.supabase.co';
const SUPABASE_ANON_KEY = process.env['SUPABASE_ANON_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb29raWR4aWh0dHRmem9kYnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzUxMDAsImV4cCI6MjA3MjgxMTEwMH0.1pFnwEKQDwDmHEKrBMYUilYDOlzR1eo5Vdn2p-wI-Ro';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table names
export const TABLES = {
  USERS: 'User',
  DAY_PLANS: 'day_plans',
  USER_DAILY_PLANS: 'user_daily_plans',
  REMINDER_TEMPLATES: 'reminder_templates',
  MISC: 'Misc',
} as const;

// Export configuration
export const config = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  port: process.env['PORT'] || 3001,
  corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  appUrl: process.env['APP_URL'] || 'http://localhost:3001',
} as const;
