// ============================================================
// CONFIGURATION — à remplir avec les valeurs de VOTRE projet
// Supabase Dashboard > Project Settings > API Keys (+ Data API pour l'URL)
// ============================================================

// L'URL de votre projet (ex: https://abcdefgh.supabase.co)
const SUPABASE_URL = "https://ohlrckwdlxfzutquxjyb.supabase.co/rest/v1/";

// La clé "anon / public" (pas un secret : la sécurité vient des règles RLS)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obHJja3dkbHhmenV0cXV4anliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MzQ4MjksImV4cCI6MjEwMTUxMDgyOX0.OtM5wKjoHBOapq72PVSP-z2tfbbCAD7kd6KK76KYEvA";

// ------------------------------------------------------------
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getSessionEtRole() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { session: null, role: null, nom: null };
  const { data, error } = await sb
    .from("app_users")
    .select("role, nom")
    .ilike("email", session.user.email)
    .maybeSingle();
  if (error || !data) return { session, role: null, nom: null };
  return { session, role: data.role, nom: data.nom };
}
