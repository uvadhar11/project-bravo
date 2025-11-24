import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Menu,
  Wallet,
  Home as HomeIcon,
  BarChart3,
  Shield,
  Info,
  Award,
  Mail,
  LogOut,
} from "lucide-react";
import { Footer } from "./ui/Footer";
import { supabase } from "../lib/supabase";
import { useAuth } from "../features/auth/AuthContext";

export default function Layout() {
  const location = useLocation(); // get url
  const navigate = useNavigate(); // react router navigation for url
  const { user } = useAuth(); // get user with custom auth hook to give user
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // define routes and icons
  const navigation = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/expenses", label: "Expense Logging", icon: Wallet },
    { path: "/reports", label: "Expense Report", icon: BarChart3 },
    { path: "/admin", label: "Admin", icon: Shield },
    { path: "/about", label: "About", icon: Info },
    { path: "/credits", label: "Credits", icon: Award },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-600" />
              <h1 className="text-slate-900 font-semibold">Expense Tracker</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild // using asChild so we can keep the Button styles while using a Link for accessibility when navigating
                    className="gap-2"
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}

              {/* Logout Button (only show if user is logged in) */}
              {user && (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-1 border-t border-slate-100 mt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}

              {/* Logout Button (Mobile) */}
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Outlet /> is a placeholder. React Router replaces this with the component for the current URL. */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
