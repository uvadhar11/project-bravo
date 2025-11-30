// import { Card } from "../components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Wallet,
//   Loader2,
// } from "lucide-react";
// import { useState } from "react";
// import { useReports } from "..//features/reports/useReports";

// const categoryData = [
//   { name: "Groceries", value: 1400, color: "#3b82f6" },
//   { name: "Rent", value: 1200, color: "#8b5cf6" },
//   { name: "Transportation", value: 400, color: "#10b981" },
//   { name: "Utilities", value: 250, color: "#f59e0b" },
//   { name: "Entertainment", value: 300, color: "#ef4444" },
// ];

// const monthlyData = [
//   { month: "Jan", income: 5000, expenses: 3200 },
//   { month: "Feb", income: 5000, expenses: 3500 },
//   { month: "Mar", income: 5200, expenses: 3100 },
//   { month: "Apr", income: 5000, expenses: 3800 },
//   { month: "May", income: 5500, expenses: 3400 },
//   { month: "Jun", income: 5000, expenses: 3600 },
//   { month: "Jul", income: 5000, expenses: 3300 },
//   { month: "Aug", income: 5200, expenses: 3700 },
//   { month: "Sep", income: 5000, expenses: 3500 },
//   { month: "Oct", income: 5000, expenses: 3550 },
// ];

// export function ExpenseReport() {
//   const [selectedMonth, setSelectedMonth] = useState("all"); // October 2025
//   const { monthlyData, categoryData, summary, loading } = useReports();

//   // const totalIncome = 5000;
//   // const totalExpenses = 3550;
//   // const balance = totalIncome - totalExpenses;

//   if (loading)
//     return (
//       <div className="flex justify-center p-12">
//         <Loader2 className="animate-spin" />
//       </div>
//     );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-slate-900">Expense Report</h1>
//           <p className="text-slate-600">
//             Visual summaries and analytics of your finances
//           </p>
//         </div>
//         <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//           <SelectTrigger className="w-48">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="October 2025">October 2025</SelectItem>
//             <SelectItem value="September 2025">September 2025</SelectItem>
//             <SelectItem value="August 2025">August 2025</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid md:grid-cols-4 gap-6">
//         <Card className="p-6 space-y-2">
//           <div className="flex items-center justify-between">
//             <p className="text-slate-600">Total Income</p>
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-5 h-5 text-green-600" />
//             </div>
//           </div>
//           <p className="text-slate-900">${summary.income.toFixed(2)}</p>
//         </Card>

//         <Card className="p-6 space-y-2">
//           <div className="flex items-center justify-between">
//             <p className="text-slate-600">Total Expenses</p>
//             <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//               <TrendingDown className="w-5 h-5 text-red-600" />
//             </div>
//           </div>
//           <p className="text-slate-900">${summary.expenses.toFixed(2)}</p>
//         </Card>

//         <Card className="p-6 space-y-2">
//           <div className="flex items-center justify-between">
//             <p className="text-slate-600">Balance</p>
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <DollarSign className="w-5 h-5 text-blue-600" />
//             </div>
//           </div>
//           <p className="text-slate-900">${summary.balance.toFixed(2)}</p>
//         </Card>

//         <Card className="p-6 space-y-2">
//           <div className="flex items-center justify-between">
//             <p className="text-slate-600">Savings Rate</p>
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Wallet className="w-5 h-5 text-purple-600" />
//             </div>
//           </div>
//           <p className="text-slate-900">{summary.savingsRate.toFixed(1)}%</p>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card className="p-6 space-y-4">
//           <h3 className="text-slate-900">Expenses by Category</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) =>
//                   `${name} ${(percent * 100).toFixed(0)}%`
//                 }
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-6 space-y-4">
//           <h3 className="text-slate-900">Category Breakdown</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={categoryData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* Monthly Trend */}
//       <Card className="p-6 space-y-4">
//         <h3 className="text-slate-900">Income vs Expenses Trend</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="income"
//               stroke="#10b981"
//               strokeWidth={2}
//             />
//             <Line
//               type="monotone"
//               dataKey="expenses"
//               stroke="#ef4444"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Card>

//       {/* Category Details */}
//       <Card className="p-6">
//         <h3 className="text-slate-900 mb-4">Category Details</h3>
//         <div className="space-y-3">
//           {categoryData.map((category, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-4 h-4 rounded"
//                   style={{ backgroundColor: category.color }}
//                 ></div>
//                 <span className="text-slate-700">{category.name}</span>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className="text-slate-600">
//                   {summary.expenses > 0
//                     ? ((category.value / summary.expenses) * 100).toFixed(1)
//                     : "0.0"}
//                   %{" "}
//                 </span>
//                 <span className="text-slate-900">
//                   ${category.value.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           ))}

//           {/* Empty state if no data */}
//           {categoryData.length === 0 && (
//             <p className="text-center text-slate-500 text-sm py-4">
//               No expense data available.
//             </p>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
  Download,
  Filter,
} from "lucide-react";
import { useReports } from "../features/reports/useReports";
import { useUserProfile } from "../features/auth/useUserProfile";
import { useTransactions } from "../features/transactions/useTransactions";
import { exportToPDF } from "../utils/exportPdf";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function ExpenseReport() {
  const [selectedMonth, setSelectedMonth] = useState("Yearly");
  const [selectedUser, setSelectedUser] = useState("all");

  // 1. Hook gets Data based on filters
  const { monthlyData, categoryData, summary, transactions, loading } =
    useReports(selectedMonth, selectedUser);

  // 2. Admin Check
  const { data: profile } = useUserProfile();
  const isAdmin = profile?.role === "admin";

  // 3. Get unique users list for Admin Dropdown
  const { transactions: allTrans } = useTransactions();
  const uniqueUsers = isAdmin
    ? Array.from(
        new Set(allTrans?.map((t) => t.profiles?.full_name).filter(Boolean))
      )
    : [];

  const handleExport = () => {
    exportToPDF(
      transactions,
      selectedMonth === "Yearly"
        ? "Yearly Report 2025"
        : `${selectedMonth} 2025 Report`,
      selectedUser === "all" ? "All Users" : selectedUser
    );
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900">Expense Report</h1>
          <p className="text-slate-600">
            {isAdmin
              ? "Organization-wide financial overview"
              : "Visual summaries and analytics of your finances"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* USER FILTER (Admin Only) */}
          {isAdmin && (
            <div className="w-[160px]">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((name: any) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* MONTH FILTER */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yearly">Yearly 2025</SelectItem>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m} 2025
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* EXPORT BUTTON */}
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
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
          <p className="text-slate-900 text-2xl font-bold">
            ${summary.income.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Total Expenses</p>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-slate-900 text-2xl font-bold">
            ${summary.expenses.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Balance</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              summary.balance >= 0 ? "text-slate-900" : "text-red-600"
            }`}
          >
            ${summary.balance.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Savings Rate</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-slate-900 text-2xl font-bold">
            {summary.savingsRate.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <Card className="p-6 flex flex-col">
          <h3 className="text-slate-900 font-semibold mb-4">
            Expenses by Category
          </h3>
          <div className="flex-1 min-h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No expense data for this period
              </div>
            )}
          </div>
        </Card>

        {/* BAR CHART */}
        <Card className="p-6 flex flex-col">
          <h3 className="text-slate-900 font-semibold mb-4">
            Category Breakdown
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* LINE CHART */}
      <Card className="p-6 space-y-4">
        <h3 className="text-slate-900 font-semibold">
          Income vs Expenses Trend
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* DETAILS TABLE */}
      <Card className="p-6">
        <h3 className="text-slate-900 font-semibold mb-4">Category Details</h3>
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
                <span className="text-slate-700 font-medium">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 text-sm">
                  {summary.expenses > 0
                    ? ((category.value / summary.expenses) * 100).toFixed(1)
                    : "0.0"}
                  %
                </span>
                <span className="text-slate-900 font-mono">
                  $
                  {category.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
