// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../../lib/supabase";
// import { startOfMonth, format, parseISO } from "date-fns";

// export function useReports() {
//   const { data: transactions, isLoading } = useQuery({
//     queryKey: ["all_transactions_report"],
//     queryFn: async () => {
//       const { data, error } = await supabase.from("transactions").select("*"); // RLS will ensure only allowed data is returned
//       if (error) throw error;
//       return data;
//     },
//     staleTime: 1000 * 60, // 1 minute cache
//   });

//   if (isLoading || !transactions) {
//     return {
//       monthlyData: [],
//       categoryData: [],
//       summary: { income: 0, expenses: 0, balance: 0, savingsRate: 0 },
//       loading: true,
//     };
//   }

//   // 1. Calculate Totals
//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   const expenses = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   // 2. Group by Category (for Pie Chart)
//   const categoryMap = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((acc, t) => {
//       acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
//       return acc;
//     }, {} as Record<string, number>);

//   const categoryData = Object.entries(categoryMap).map(
//     ([name, value], index) => ({
//       name,
//       value,
//       color: `hsl(${index * 45}, 70%, 50%)`, // Auto-generate distinct colors
//     })
//   );

//   // 3. Group by Month (for Line Chart)
//   const monthMap = transactions.reduce((acc, t) => {
//     const monthKey = format(parseISO(t.date), "MMM"); // "Jan", "Feb"
//     if (!acc[monthKey])
//       acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };

//     if (t.type === "income") acc[monthKey].income += Number(t.amount);
//     // expenses are stored as negative values in DB so convert to positive to use them
//     else acc[monthKey].expenses += Math.abs(Number(t.amount));

//     return acc;
//   }, {} as Record<string, any>);

//   const monthlyData = Object.values(monthMap);

//   return {
//     loading: false,
//     categoryData,
//     monthlyData,
//     summary: {
//       income,
//       expenses,
//       balance: income - expenses,
//       savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
//     },
//   };
// }
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { format, parseISO } from "date-fns";
import { Database } from "../../types/supabase";

// Define the shape manually to satisfy TypeScript
export type TransactionWithProfile = Database['public']['Tables']['transactions']['Row'] & {
  profiles: { full_name: string | null } | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: "#3b82f6", Rent: "#8b5cf6", Utilities: "#f59e0b",
  Entertainment: "#ef4444", Transportation: "#10b981", Health: "#06b6d4",
  Salary: "#22c55e", Freelance: "#84cc16", Other: "#94a3b8",
  Investments: "#6366f1", Gift: "#ec4899",
};

export function useReports(selectedMonth: string = "Yearly", selectedUser: string = "all") {
  
  // 1. FETCH DATA (MANUAL JOIN STRATEGY)
  const { data: allTransactions, isLoading } = useQuery({
    queryKey: ["all_transactions_report"],
    queryFn: async () => {
      // A. Fetch Raw Transactions
      const { data: transData, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .order('date', { ascending: true });
      
      if (transError) throw transError;
      if (!transData || transData.length === 0) return [];

      // B. Fetch Profiles
      const userIds = Array.from(new Set(
        transData.map(t => t.user_id).filter((id): id is string => !!id)
      ));

      if (userIds.length === 0) return transData as TransactionWithProfile[];

      const { data: profilesData, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profError) throw profError;

      // C. Combine in Memory
      const profileMap = new Map(profilesData?.map(p => [p.id, p]));

      const combinedData = transData.map(t => ({
        ...t,
        profiles: (t.user_id && profileMap.get(t.user_id)) || { full_name: "Unknown" }
      }));

      return combinedData as TransactionWithProfile[];
    },
    staleTime: 1000 * 60 * 5
  });

  if (isLoading || !allTransactions) {
    return { 
      monthlyData: [], categoryData: [], transactions: [],
      summary: { income: 0, expenses: 0, balance: 0, savingsRate: 0 },
      loading: true 
    };
  }

  // 2. APPLY FILTERS (Month + User)
  const filteredTransactions = allTransactions.filter(t => {
    // Filter by User
    if (selectedUser !== "all" && t.profiles?.full_name !== selectedUser) {
      return false;
    }

    // Filter by Month
    if (selectedMonth === "Yearly") return true;
    const tMonth = format(parseISO(t.date), "MMM"); 
    return tMonth === selectedMonth; 
  });

  // 3. CALCULATE STATS
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryMap: Record<string, number> = {};
  const monthMap: Record<string, any> = {};

  filteredTransactions.forEach(t => {
    const amount = Number(t.amount);
    const date = parseISO(t.date);
    const monthKey = format(date, "MMM");

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, income: 0, expenses: 0 };
    }

    if (t.type === 'income') {
      totalIncome += amount;
      monthMap[monthKey].income += amount;
    } else {
      const absAmount = Math.abs(amount);
      totalExpenses += absAmount; 
      monthMap[monthKey].expenses += absAmount;

      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += absAmount;
    }
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value], index) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || `hsl(${(index * 137) % 360}, 70%, 50%)`
    }))
    .sort((a, b) => b.value - a.value);

  return {
    loading: false,
    categoryData,
    monthlyData: Object.values(monthMap),
    transactions: filteredTransactions, // Passed to PDF Export
    summary: {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    }
  };
}