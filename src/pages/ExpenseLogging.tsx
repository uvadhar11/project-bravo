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
} from "../components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Filter } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "../features/transactions/useTransactions";
import { useUserProfile } from "../features/auth/useUserProfile";

type EntryType = "income" | "expense";
type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly" | "One-time";

// Fixed lists matching your Figma/Report colors
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

export function ExpenseLogging() {
  const { transactions, isLoading, createTransaction, deleteTransaction } =
    useTransactions();
  const { data: profile } = useUserProfile();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const isAdmin = profile?.role === "admin";

  // Strict filtering for Admin Dropdown
  const uniqueUsers = isAdmin
    ? Array.from(
        new Set(
          transactions
            ?.map((t) => t.profiles?.full_name)
            .filter((name): name is string => !!name)
        )
      )
    : [];

  const displayedTransactions = transactions?.filter((t) => {
    if (selectedUser === "all") return true;
    return t.profiles?.full_name === selectedUser;
  });

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

    // Auto-fix negatives
    const finalAmount =
      formData.type === "expense"
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

    if (editingEntry) {
      toast.info("Edit functionality coming soon!");
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
          onError: (err) => {
            toast.error(`Error: ${err.message}`);
          },
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
      category: "", // Reset category
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

  // Decide which list to show based on type
  const currentCategories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900">Expense Logging</h1>
          <p className="text-slate-600">
            Add, edit, and delete income and expense entries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="w-[200px]">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Filter by User" />
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
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: EntryType) => {
                      setFormData({ ...formData, type: value, category: "" }); // Clear category on type switch
                    }}
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

                {/* Category Selection (Dynamic List) */}
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

                {/* Amount */}
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

                {/* Period */}
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

                {/* Date */}
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

                {/* Description */}
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
              <TableHead>Date</TableHead>
              {isAdmin && <TableHead>User</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTransactions?.map((entry) => (
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
