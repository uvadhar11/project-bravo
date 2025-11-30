import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "../features/transactions/useTransactions";
import { useUserProfile } from "../features/auth/useUserProfile";

type EntryType = "income" | "expense";
type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly" | "One-time";
type SortConfig = { key: "date" | "amount"; direction: "asc" | "desc" } | null;

const EXPENSE_CATEGORIES = [
  "Rent",
  "Groceries",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Gift",
  "Other",
];
const ALL_CATEGORIES = [
  ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
].sort();

export function ExpenseLogging() {
  const {
    transactions,
    isLoading,
    createTransaction,
    deleteTransaction,
    updateTransaction,
  } = useTransactions();
  const { data: profile } = useUserProfile();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  // --- FILTER STATES ---
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");

  // --- SORT STATE ---
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  }); // Default to newest first

  const isAdmin = profile?.role === "admin";

  const uniqueUsers = isAdmin
    ? Array.from(
        new Set(
          transactions
            ?.map((t) => t.profiles?.full_name)
            .filter((name): name is string => !!name)
        )
      )
    : [];

  // 1. FILTERING LOGIC
  const filteredTransactions = transactions?.filter((t) => {
    if (
      isAdmin &&
      selectedUser !== "all" &&
      t.profiles?.full_name !== selectedUser
    )
      return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterDateFrom && t.date < filterDateFrom) return false;
    if (filterDateTo && t.date > filterDateTo) return false;
    const absAmount = Math.abs(t.amount);
    if (filterMinAmount && absAmount < parseFloat(filterMinAmount))
      return false;
    if (filterMaxAmount && absAmount > parseFloat(filterMaxAmount))
      return false;
    return true;
  });

  // 2. SORTING LOGIC (Applied after filtering)
  const sortedTransactions = [...(filteredTransactions || [])].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    // Handle Date Sort
    if (key === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle Amount Sort (Compare absolute values usually makes more sense for mixed lists)
    if (key === "amount") {
      const amountA = Math.abs(Number(a.amount));
      const amountB = Math.abs(Number(b.amount));
      return direction === "asc" ? amountA - amountB : amountB - amountA;
    }

    return 0;
  });

  // Helper to handle header clicks
  const handleSort = (key: "date" | "amount") => {
    setSortConfig((current) => {
      if (current?.key === key) {
        // Toggle direction if clicking same header
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      // Default to Descending (Newest/Highest) for new key
      return { key, direction: "desc" };
    });
  };

  // Helper to render the arrow icon
  const getSortIcon = (key: "date" | "amount") => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const activeFilters = [
    filterCategory !== "all",
    filterDateFrom !== "",
    filterDateTo !== "",
    filterMinAmount !== "",
    filterMaxAmount !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterMinAmount("");
    setFilterMaxAmount("");
  };

  const [formData, setFormData] = useState({
    type: "expense" as EntryType,
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    period: "Monthly" as TimePeriod,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(formData.amount);
    const finalAmount =
      formData.type === "expense"
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

    if (editingEntry) {
      updateTransaction.mutate(
        {
          id: editingEntry.id,
          updates: {
            name: formData.description,
            amount: finalAmount,
            category: formData.category,
            date: formData.date,
            type: formData.type,
            period: formData.period,
          },
        },
        {
          onSuccess: () => {
            toast.success("Entry updated successfully!");
            resetForm();
          },
          onError: (err) => toast.error(`Error: ${err.message}`),
        }
      );
    } else {
      createTransaction.mutate(
        {
          name: formData.description,
          amount: finalAmount,
          category: formData.category,
          date: formData.date,
          type: formData.type,
          period: formData.period,
        },
        {
          onSuccess: () => {
            toast.success("Entry added successfully!");
            resetForm();
          },
          onError: (err) => toast.error(`Error: ${err.message}`),
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteTransaction.mutate(id, {
        onSuccess: () => toast.success("Entry deleted successfully!"),
      });
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      category: entry.category,
      amount: Math.abs(entry.amount).toString(),
      description: entry.name,
      date: entry.date,
      period: entry.period,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      period: "Monthly",
    });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  const currentCategories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900">Expense Logging</h1>
          <p className="text-slate-600">
            Add, edit, and delete income and expense entries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* USER FILTER */}
          {isAdmin && (
            <div className="w-[150px] md:w-[200px]">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ADVANCED FILTERS */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <Filter className="w-4 h-4" />
                Filters
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Filter Entries</h4>
                  {activeFilters > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-red-500"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {ALL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Min Amount</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filterMinAmount}
                      onChange={(e) => setFilterMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Amount</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={filterMaxAmount}
                      onChange={(e) => setFilterMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* ADD BUTTON */}
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? "Edit Entry" : "Add New Entry"}
                </DialogTitle>
                {/* Added DialogDescription for accessibility */}
                <DialogDescription>
                  Fill in the details below to{" "}
                  {editingEntry ? "update the" : "create a new"} transaction
                  record.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: EntryType) =>
                      setFormData({ ...formData, type: value, category: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* ... Category, Amount, Period, Date, Description fields same as previous ... */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: TimePeriod) =>
                      setFormData({ ...formData, period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Daily", "Weekly", "Monthly", "Yearly", "One-time"].map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createTransaction.isPending}
                  >
                    {createTransaction.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingEntry ? "Update" : "Add"} Entry
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {/* CLICKABLE SORT HEADERS */}
              <TableHead
                className="cursor-pointer hover:text-slate-900"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon("date")}
                </div>
              </TableHead>

              {isAdmin && <TableHead>User</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Period</TableHead>

              {/* CLICKABLE SORT HEADER */}
              <TableHead
                className="text-right cursor-pointer hover:text-slate-900"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {getSortIcon("amount")}
                </div>
              </TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 8 : 7}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>

                  {isAdmin && (
                    <TableCell className="font-medium text-slate-600">
                      {entry.profiles?.full_name || "Unknown"}
                    </TableCell>
                  )}

                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 rounded capitalize text-sm font-medium ${
                        entry.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell className="capitalize">{entry.period}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${Math.abs(entry.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
