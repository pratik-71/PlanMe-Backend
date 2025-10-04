"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.TABLES = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const SUPABASE_URL = process.env['SUPABASE_URL'] || 'https://lmookidxihtttfzodbvf.supabase.co';
const SUPABASE_ANON_KEY = process.env['SUPABASE_ANON_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb29raWR4aWh0dHRmem9kYnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzUxMDAsImV4cCI6MjA3MjgxMTEwMH0.1pFnwEKQDwDmHEKrBMYUilYDOlzR1eo5Vdn2p-wI-Ro';
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
exports.TABLES = {
    USERS: 'User',
    DAY_PLANS: 'day_plans',
    USER_DAILY_PLANS: 'user_daily_plans',
    REMINDER_TEMPLATES: 'reminder_templates',
};
exports.config = {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    port: process.env['PORT'] || 3001,
    corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
};
//# sourceMappingURL=database.js.map