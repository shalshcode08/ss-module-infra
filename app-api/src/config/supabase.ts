import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./index";

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
