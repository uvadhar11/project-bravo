import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// import.meta.env is used to access Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// //// <reference types="vite/client" />
// ^ needs to be the first line since it is a triple-slash directive telling TypeScript to include vite's type definitions. allows us to use import.meta.env without type errors to access Vite environment variables. Need to keep the comments lower here otherwise will get errors when trying to use import.meta.env in other files.
// see vite-env.d.ts for more details since that file keeps erroring if I have comments in there for some reason

// error handling for missing env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

// IMP: run npm run gen:types to regenerate types after DB changes (see package.json)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
