import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

// Define types manually to be safe
export type Transaction =
  Database["public"]["Tables"]["transactions"]["Row"] & {
    profiles: { full_name: string | null } | null;
  };

export type NewTransaction =
  Database["public"]["Tables"]["transactions"]["Insert"];

export type UpdateTransaction = Partial<NewTransaction>;

export function useTransactions() {
  const queryClient = useQueryClient();

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      // STEP 1: Fetch Transactions
      const { data: transData, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (transError) throw transError;
      if (!transData || transData.length === 0) return [];

      // STEP 2: Fetch Profiles (FIXED)
      // We use a "Type Predicate" here: (id): id is string => !!id
      // This tells TypeScript: "I promise the resulting array contains ONLY strings, no nulls."
      const userIds = Array.from(
        new Set(
          transData.map((t) => t.user_id).filter((id): id is string => !!id)
        )
      );

      if (userIds.length === 0) return transData as Transaction[];

      const { data: profilesData, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds); // <--- Error fixed: userIds is now strictly string[]

      if (profError) throw profError;

      // STEP 3: Combine them
      const profileMap = new Map(profilesData?.map((p) => [p.id, p]));

      const combinedData = transData.map((t) => ({
        ...t,
        // Safe lookup: Check if user_id exists before trying to get it from the map
        profiles: (t.user_id && profileMap.get(t.user_id)) || {
          full_name: "Unknown",
        },
      }));

      return combinedData as Transaction[];
    },
    staleTime: 0,
  });

  // --- Mutations (Create/Delete) ---

  const createTransaction = useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...newTransaction, user_id: user.id })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateTransaction;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["all_transactions_report"] });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    deleteTransaction,
    updateTransaction,
  };
}
