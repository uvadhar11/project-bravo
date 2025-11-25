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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type EntryType = "income" | "expense";
type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";

interface Entry {
  id: string;
  type: EntryType;
  category: string;
  amount: number;
  description: string;
  date: string;
  period: TimePeriod;
}

const mockEntries: Entry[] = [
  {
    id: "1",
    type: "income",
    category: "Salary",
    amount: 5000,
    description: "Monthly salary",
    date: "2025-10-01",
    period: "monthly",
  },
  {
    id: "2",
    type: "expense",
    category: "Groceries",
    amount: 350,
    description: "Weekly groceries",
    date: "2025-10-15",
    period: "weekly",
  },
  {
    id: "3",
    type: "expense",
    category: "Rent",
    amount: 1200,
    description: "Monthly rent",
    date: "2025-10-01",
    period: "monthly",
  },
  {
    id: "4",
    type: "expense",
    category: "Transportation",
    amount: 50,
    description: "Gas",
    date: "2025-10-20",
    period: "weekly",
  },
];

export function ExpenseLogging() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [formData, setFormData] = useState({
    type: "expense" as EntryType,
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    period: "monthly" as TimePeriod,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEntry) {
      // Update existing entry
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id
            ? { ...entry, ...formData, amount: parseFloat(formData.amount) }
            : entry
        )
      );
      toast.success("Entry updated successfully!");
    } else {
      // Add new entry
      const newEntry: Entry = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
      };
      setEntries([...entries, newEntry]);
      toast.success("Entry added successfully!");
    }

    resetForm();
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      category: entry.category,
      amount: entry.amount.toString(),
      description: entry.description,
      date: entry.date,
      period: entry.period,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast.success("Entry deleted successfully!");
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      period: "monthly",
    });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Expense Logging</h1>
          <p className="text-slate-600">
            Add, edit, and delete your income and expense entries
          </p>
        </div>
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
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: EntryType) =>
                    setFormData({ ...formData, type: value })
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

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Groceries, Salary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
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
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 rounded ${
                      entry.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {entry.type}
                  </span>
                </TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="capitalize">{entry.period}</TableCell>
                <TableCell className="text-right">
                  ${entry.amount.toFixed(2)}
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
