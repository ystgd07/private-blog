import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
  id?: string;
  title: string;
  content: string;
  category: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  published?: boolean;
  views?: number;
}
