import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useReports } from "..//features/reports/useReports";

const categoryData = [
  { name: "Groceries", value: 1400, color: "#3b82f6" },
  { name: "Rent", value: 1200, color: "#8b5cf6" },
  { name: "Transportation", value: 400, color: "#10b981" },
  { name: "Utilities", value: 250, color: "#f59e0b" },
  { name: "Entertainment", value: 300, color: "#ef4444" },
];

const monthlyData = [
  { month: "Jan", income: 5000, expenses: 3200 },
  { month: "Feb", income: 5000, expenses: 3500 },
  { month: "Mar", income: 5200, expenses: 3100 },
  { month: "Apr", income: 5000, expenses: 3800 },
  { month: "May", income: 5500, expenses: 3400 },
  { month: "Jun", income: 5000, expenses: 3600 },
  { month: "Jul", income: 5000, expenses: 3300 },
  { month: "Aug", income: 5200, expenses: 3700 },
  { month: "Sep", income: 5000, expenses: 3500 },
  { month: "Oct", income: 5000, expenses: 3550 },
];

export function ExpenseReport() {
  const [selectedMonth, setSelectedMonth] = useState("all"); // October 2025
  const { monthlyData, categoryData, summary, loading } = useReports();

  // const totalIncome = 5000;
  // const totalExpenses = 3550;
  // const balance = totalIncome - totalExpenses;

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Expense Report</h1>
          <p className="text-slate-600">
            Visual summaries and analytics of your finances
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="October 2025">October 2025</SelectItem>
            <SelectItem value="September 2025">September 2025</SelectItem>
            <SelectItem value="August 2025">August 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Total Income</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-slate-900">${summary.income.toFixed(2)}</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Total Expenses</p>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-slate-900">${summary.expenses.toFixed(2)}</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Balance</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-900">${summary.balance.toFixed(2)}</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Savings Rate</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-slate-900">{summary.savingsRate.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-slate-900">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-slate-900">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="p-6 space-y-4">
        <h3 className="text-slate-900">Income vs Expenses Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Details */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Category Details</h3>
        <div className="space-y-3">
          {categoryData.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-slate-700">{category.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  {summary.expenses > 0
                    ? ((category.value / summary.expenses) * 100).toFixed(1)
                    : "0.0"}
                  %{" "}
                </span>
                <span className="text-slate-900">
                  ${category.value.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Empty state if no data */}
          {categoryData.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-4">
              No expense data available.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
