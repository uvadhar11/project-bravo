import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";
import { toast } from "sonner";

// 1. Type Definition (Good practice to export this)
export type Profile = Database['public']['Tables']['profiles']['Row'];

// 2. Helper Hook: Get the current user's Organization ID & Name
export function useOrganization() {
  return useQuery({
    queryKey: ["my-org-details"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null; // Handle not logged in gracefully

      // Get my profile to find my Org ID and Name
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("organization_id, organizations(name, join_code)")
        .eq("id", user.id)
        .single();

      // If no profile or no org_id, return null (This triggers the Onboarding redirect)
      if (!profile?.organization_id) return null;

      if (error) throw error;

      return {
        id: profile?.organization_id,
        name: profile?.organizations?.name, // Join automatically returns an object/array
        joinCode: profile?.organizations?.join_code,
      };
    },
    retry: false,
    staleTime: 0
  });
}

// 3. Main Hook: Managed Profiles (Users)
export function useProfiles() {
  const queryClient = useQueryClient();
  const { data: org, isLoading: isOrgLoading } = useOrganization();

  // A. Fetch Profiles (Only for my Org)
  const { data: profiles, isLoading: isProfilesLoading, error } = useQuery({
    queryKey: ["profiles", org?.id], // Refetch if Org changes
    enabled: !!org?.id, // Only run if we have an Org ID
    queryFn: async () => {
      // 2. Type Gate: Stop TypeScript from complaining about "string | null"
      if (!org?.id) throw new Error("Organization ID is missing");

      // RLS policies handle security, but we can be explicit
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("organization_id", org!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });

  // B. Toggle User Status (Active <-> Inactive)
  const toggleStatus = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
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
      toast.success("User status updated");
    },
    onError: (err: Error) => {
      toast.error(`Error: ${err.message}`);
    }
  });

  // C. Invite User (Via Edge Function)
  const inviteUser = useMutation({
    mutationFn: async (email: string) => {
      if (!org?.id) throw new Error("Organization ID not found. Cannot send invite.");

      // redirect url
      const redirectUrl = `${window.location.origin}/set-password`;

      // Call the Edge Function we created earlier
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: { 
          email, 
          // orgName: org.name,
          orgId: org.id,
          redirectTo: redirectUrl, 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error("Failed to send invite. Check console for details.");
    }
  });

  return { 
    profiles, 
    isLoading: isProfilesLoading || isOrgLoading, 
    error, 
    toggleStatus, 
    inviteUser 
  };
}

/*
TODO: modify signup flow with IDs
const createOrg = async (orgName: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Create Org
  const { data: org, error } = await supabase
    .from('organizations')
    .insert({ name: orgName })
    .select()
    .single();
    
  if (error) return toast.error(error.message);

  // 2. Link User to Org as Admin
  await supabase
    .from('profiles')
    .update({ 
      organization_id: org.id,
      role: 'admin' 
    })
    .eq('id', user.id);

  window.location.reload(); // Refresh to load new permissions
};
*/
