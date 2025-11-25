import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useProfiles() {
  const queryClient = useQueryClient();

  // 1. Fetch All Users
  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // 2. Toggle User Status (Active/Inactive)
  const toggleStatus = useMutation({
    mutationFn: async ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: string;
    }) => {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  // 3. Invite User (Mock for now - see note below)
  const inviteUser = useMutation({
    mutationFn: async (email: string) => {
      // NOTE: Real server-side invites require Supabase Edge Functions
      // because they need the SERVICE_ROLE_KEY.
      // For a client-side app, we usually just create a record or tell them to sign up.
      console.log("Inviting", email);
      return true;
    },
  });

  return { profiles, isLoading, error, toggleStatus, inviteUser };
}
