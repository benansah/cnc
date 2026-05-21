import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration missing. Please set environment variables.");
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// For backward compatibility
export const supabase = {
  from: (table: string) => getSupabaseClient().from(table),
  auth: {
    getSession: () => getSupabaseClient().auth.getSession(),
    signInWithPassword: (props: any) => getSupabaseClient().auth.signInWithPassword(props),
  },
} as any;

// Server-side client with service role key for admin operations
export const createServerSupabaseClient = () => {
  if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role key missing. Please set environment variables.");
  }
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
