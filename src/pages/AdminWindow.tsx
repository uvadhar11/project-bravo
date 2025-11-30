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
} from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "../utils/export";
import { useOrganization, useProfiles } from "../features/admin/useAdmin";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");

  if (isLoading) return <div>Loading Admin Dashboard...</div>;

  const filteredUsers =
    profiles?.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name &&
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

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

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call the Edge Function
    inviteUser.mutate(newUserEmail, {
      onSuccess: () => {
        toast.success(`Invite sent to ${newUserEmail}`);
        setIsAddUserOpen(false);
        setNewUserEmail("");
      },
    });
  };

  const copyJoinCode = () => {
    if (org?.joinCode) {
      navigator.clipboard.writeText(org.joinCode);
      toast.success("Join code copied to clipboard");
    }
  };

  const handleExportReport = (reportType: string) => {
    // In a real app, you'd likely fetch specific data for the report here.
    // For now, we can export the current users list as an example
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
          <p className="text-slate-600">Manage your organization and users</p>
        </div>

        {/* Organization Card with Join Code */}
        {org && (
          <Card className="flex items-center gap-4 p-3 bg-blue-50 border-blue-100">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Organization
              </p>
              <p className="text-sm font-bold text-slate-900">{org.name}</p>
            </div>
            <div className="h-8 w-px bg-blue-200 mx-2" />
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Join Code
              </p>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={copyJoinCode}
                title="Click to copy"
              >
                <code className="text-lg font-mono font-bold text-blue-700">
                  {org.joinCode || "Loading..."}
                </code>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Stats Cards (Dynamic) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Total Users</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-900 text-2xl font-bold">
            {profiles?.length}
          </p>
          <p className="text-slate-600 text-sm">
            {profiles?.filter((u) => u.status === "active").length} active
          </p>
        </Card>
        {/* ... Other cards ... */}
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Organization Information</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-900 text-2xl font-bold">
            {profiles?.length}
          </p>
          <p className="text-slate-600 text-sm">
            {profiles?.filter((u) => u.status === "active").length} active
          </p>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        {/* ... TabsList ... */}
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
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
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
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
            </Dialog>
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

        {/* All Entries Tab */}
        <TabsContent value="entries" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-slate-900">All User Entries</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>2025-10-25</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Income</Badge>
                    </TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell className="text-right">$5,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>2025-10-24</TableCell>
                    <TableCell>
                      <Badge>Expense</Badge>
                    </TableCell>
                    <TableCell>Groceries</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>2025-10-23</TableCell>
                    <TableCell>
                      <Badge>Expense</Badge>
                    </TableCell>
                    <TableCell>Rent</TableCell>
                    <TableCell className="text-right">$1,200.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900">User Activity Report</h3>
              <p className="text-slate-600">
                Generate comprehensive reports on user activity and engagement.
              </p>
              <Button
                className="gap-2 w-full"
                onClick={() => handleExportReport("User Activity")}
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900">Financial Summary</h3>
              <p className="text-slate-600">
                System-wide financial summaries including all users' income and
                expenses.
              </p>
              <Button
                className="gap-2 w-full"
                onClick={() => handleExportReport("Financial Summary")}
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900">Category Analysis</h3>
              <p className="text-slate-600">
                Detailed breakdown of spending patterns across all categories.
              </p>
              <Button
                className="gap-2 w-full"
                onClick={() => handleExportReport("Category Analysis")}
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-slate-900">Monthly Trends</h3>
              <p className="text-slate-600">
                Track monthly trends in income, expenses, and savings rates.
              </p>
              <Button
                className="gap-2 w-full"
                onClick={() => handleExportReport("Monthly Trends")}
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
