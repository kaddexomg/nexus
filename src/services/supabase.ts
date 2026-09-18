import { createClient } from '@supabase/supabase-js';

const meta = import.meta as unknown as { env?: Record<string, string> };
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://qiykiwhipbcvnyfqoyuz.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWtpd2hpcGJjdm55ZnFveXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODgyMzIsImV4cCI6MjEwNTI2NDIzMn0.CE6ruZYNyMyDP0jdHKJf5UxyJT6p_aBgnIY-mdsUnSM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin' | 'referee';
  walletBalanceUsd: number;
  createdAt: string;
}
