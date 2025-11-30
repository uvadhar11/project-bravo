import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

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

  // check user status - whether they are active or inactive to disable their account
  const checkUserStatus = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking user status:", error);
      return;
    }

    if (profile?.status === "inactive") {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      toast.error(
        "Your account has been deactivated. Please contact your administrator."
      );
    }
  };

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // check user status (enabled/disabled account)
      if (session?.user) {
        checkUserStatus(session.user.id);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Check status on login or token refresh - whether they are disabled or not
      if (session?.user) {
        checkUserStatus(session.user.id);
      }

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
