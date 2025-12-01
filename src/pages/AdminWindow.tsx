import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  FileText,
  BarChart3,
  Search,
  UserPlus,
  Download,
  Building2,
  Copy,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "../utils/export";
import { useOrganization, useProfiles } from "../features/admin/useAdmin";
import { useTransactions } from "../features/transactions/useTransactions";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    joinDate: "2025-01-01",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2025-03-15",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    joinDate: "2025-05-20",
  },
  {
    id: "4",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2025-02-10",
  },
];

export function AdminWindow() {
  const { profiles, isLoading, toggleStatus, inviteUser } = useProfiles();
  const { data: org } = useOrganization(); // Get Org Details including Join Code
  const { transactions } = useTransactions(); // get transactions

  const [searchTerm, setSearchTerm] = useState("");
  // const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  // const [newUserEmail, setNewUserEmail] = useState("");

  if (isLoading) return <div>Loading Admin Dashboard...</div>;

  const filteredUsers =
    profiles?.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name &&
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  // Calculate transaction stats
  const activeUsers =
    profiles?.filter((u) => u.status === "active").length || 0;
  const totalTransactions = transactions?.length || 0;
  const currentMonthTransactions =
    transactions?.filter((t) => {
      const tDate = new Date(t.date);
      const now = new Date();
      return (
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    }).length || 0;

  const handleStatusChange = (id: string, currentStatus: string | null) => {
    // If status is null/undefined, assume 'active' to toggle it to 'inactive'
    const status = currentStatus || "active";

    toggleStatus.mutate(
      { id, currentStatus: status },
      {
        onSuccess: () => toast.success("User status updated"),
      }
    );
  };

  // for adding user via email invite
  // const handleInvite = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   inviteUser.mutate(newUserEmail, {
  //     onSuccess: () => {
  //       toast.success(`Invite sent to ${newUserEmail}`);
  //       setIsAddUserOpen(false);
  //       setNewUserEmail("");
  //     },
  //   });
  // };

  const copyJoinCode = () => {
    if (org?.joinCode) {
      navigator.clipboard.writeText(org.joinCode);
      toast.success("Join code copied to clipboard");
    }
  };

  const handleExportReport = (reportType: string) => {
    if (reportType === "User Activity" && filteredUsers) {
      exportToCSV(filteredUsers, "user_activity_report");
    } else {
      toast.success(`Generating ${reportType}... (Mock)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ... Title Section ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-slate-900 text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Org Info & Join Code */}
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Organization
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {org?.name}
                </h3>

                <div
                  className="flex items-center gap-2 mt-4 cursor-pointer bg-white w-fit px-3 py-1 rounded-full border border-blue-200 hover:border-blue-400 transition-colors"
                  onClick={copyJoinCode}
                  title="Click to copy join code"
                >
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    Code:
                  </span>
                  <code className="text-sm font-mono font-bold text-blue-700">
                    {org?.joinCode || "..."}
                  </code>
                  <Copy className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Card 2: Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Members
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {profiles?.length}
                </h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  {activeUsers} active now
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Card 3: Transaction Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Transactions
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {totalTransactions.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">
                    {currentMonthTransactions}
                  </span>{" "}
                  this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* functionality for invite user with email */}
            {/* <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Invite
                  </Button>
                </form>
              </DialogContent>
            </Dialog> */}
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "outline"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.status)}
                        disabled={toggleStatus.isPending}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900 font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> User Activity Report
              </h3>
              <p className="text-slate-600 text-sm">
                Generate comprehensive CSV report of all users, their roles, and
                status.
              </p>
              <Button
                className="gap-2 w-full"
                onClick={() => handleExportReport("User Activity")}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900 font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" /> Financial
                Summary
              </h3>
              <p className="text-slate-600 text-sm">
                For detailed financial charts and PDF exports, please visit the
                main Reports tab.
              </p>
              <Button
                variant="outline"
                className="gap-2 w-full"
                onClick={() => (window.location.href = "/reports")}
              >
                <BarChart3 className="w-4 h-4" />
                Go to Reports
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
