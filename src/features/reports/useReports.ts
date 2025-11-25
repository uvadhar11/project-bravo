import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { startOfMonth, format, parseISO } from "date-fns";

export function useReports() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["all_transactions_report"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !transactions) {
    return {
      monthlyData: [],
      categoryData: [],
      summary: { income: 0, expenses: 0, balance: 0, savingsRate: 0 },
      loading: true,
    };
  }

  // 1. Calculate Totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 2. Group by Category (for Pie Chart)
  const categoryMap = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap).map(
    ([name, value], index) => ({
      name,
      value,
      color: `hsl(${index * 45}, 70%, 50%)`, // Auto-generate distinct colors
    })
  );

  // 3. Group by Month (for Line Chart)
  const monthMap = transactions.reduce((acc, t) => {
    const monthKey = format(parseISO(t.date), "MMM"); // "Jan", "Feb"
    if (!acc[monthKey])
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };

    if (t.type === "income") acc[monthKey].income += Number(t.amount);
    else acc[monthKey].expenses += Number(t.amount);

    return acc;
  }, {} as Record<string, any>);

  const monthlyData = Object.values(monthMap);

  return {
    loading: false,
    categoryData,
    monthlyData,
    summary: {
      income,
      expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    },
  };
}
