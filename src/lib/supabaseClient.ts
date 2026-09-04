import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acdgxgqlafhlqaapobxh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zTE4-vKK1BhBmsRgR5UG7Q_pBL9c7dl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
