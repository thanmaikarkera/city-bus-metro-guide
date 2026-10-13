/*
  config.js - YOUR SUPABASE SETTINGS
  ----------------------------------
  Paste your own values here (see README.md, Part 1):
  Supabase dashboard > your project > "Connect" button (or Project Settings > API Keys)

  - SUPABASE_URL      = Project URL, e.g. https://abcdxyz.supabase.co
  - SUPABASE_ANON_KEY = the PUBLIC key. Newer projects call it the
                        "publishable" key (starts with sb_publishable_...).
                        Older projects call it the "anon public" key (starts with eyJ...).
                        Either one works.

  Is it safe to put the anon key in a public website?  YES.
  It is meant to be public. Our database only allows READING (see schema.sql,
  "Row Level Security"), so nobody can change the data with this key.
  NEVER paste the "secret" / "service_role" key here — that one is private.

  If you leave these empty, the site uses the built-in sample data (data.js).
*/

const SUPABASE_URL = "https://xjvdmzmbnuljgxfhkccy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aKiAmCkkN85s4_f-TsPHfg_d_FKGYlZ";
