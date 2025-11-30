import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Building2, Users } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // OPTION A: Create New Organization
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    // ensure org name is passed in
    if (!orgName.trim())
      return toast.error("Please enter an organization name");

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Create the Organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name: orgName, owner_id: user.id })
        .select()
        .single();

      if (orgError) throw orgError;

      // Update user profile to link to this Org (as Admin)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          organization_id: org.id,
          role: "admin",
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // invalidate queries to force react query to re-fetch the user profile before nagivating
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["my-org-details"] });

      toast.success("Organization created!");
      // Force a reload so the AuthContext picks up the new organization_id
      navigate("/expenses");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // OPTION B: Join Existing Organization
  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return toast.error("Please enter a join code");

    setLoading(true);

    try {
      // Call the secure Database Function (RPC)
      const { error } = await supabase.rpc("join_organization", {
        join_code_input: joinCode.trim(),
      });

      if (error) throw error;

      // invalidate queries to force react query to re-fetch the user profile before nagivating
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["my-org-details"] });

      toast.success("Successfully joined the organization!");
      navigate("/expenses");
    } catch (error: any) {
      console.error(error);
      // Friendly error message if code is wrong
      toast.error(
        error.message === "Invalid join code"
          ? "Invalid join code. Please try again."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Card 1: Create Organization */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Create Workspace</CardTitle>
            <CardDescription>
              Start a new organization for your company or family. You will be
              the admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  placeholder="Acme Corp"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Join Existing */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Join Team</CardTitle>
            <CardDescription>
              Have an invite code? Enter it here to join an existing workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinOrg} className="space-y-4">
              <div className="space-y-2">
                <Label>Join Code</Label>
                <Input
                  placeholder="e.g. 8f3a2b1c"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                />
              </div>
              <Button
                variant="outline"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Joining..." : "Join Organization"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
