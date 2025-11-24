import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase"; // Import the huge type definition

// 1. EXTRACT TYPES AUTOMATICALLY
// "Row" = the shape of the data when you SELECT
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

// "Insert" = the shape required to ADD (handles optional 'id', 'created_at')
export type NewTransaction =
  Database["public"]["Tables"]["transactions"]["Insert"];

export function useTransactions() {
  const queryClient = useQueryClient();

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      // 2. NO MORE MANUAL CASTING
      // The client now knows that .from('transactions') returns Transaction[]
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      // No need for "as Transaction[]" anymore!
      return data;
    },
  });

  const createTransaction = useMutation({
    // 3. STRICT TYPING ON INPUTS
    // TypeScript will yell at you if 'newTransaction' is missing a required DB column
    mutationFn: async (newTransaction: NewTransaction) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...newTransaction, user_id: user.id }) // user.id might be required in DB
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

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    deleteTransaction,
  };
}
