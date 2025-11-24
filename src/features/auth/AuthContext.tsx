import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // while checking user session, show loading screen to prevent the flash of white screen for a second
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {!loading && children}{" "}
      {/* only render children when not loading. prevents flash of unauthenticated content */}
    </AuthContext.Provider>
  );
};

// hook we export for other components to use
export const useAuth = () => {
  return useContext(AuthContext);
};
