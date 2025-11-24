import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./button";
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
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";

export default function Header() {
  const location = useLocation(); // get url
  const navigate = useNavigate(); // react router navigation for url
  const { user } = useAuth(); // get user with custom auth hook to give user
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // unauthenticated links
  const guestLinks = [
    { path: "/about", label: "About", icon: Info },
    { path: "/credits", label: "Credits", icon: Award },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  // authenticated links
  const userLinks = [
    { path: "/expenses", label: "Dashboard", icon: Wallet },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin", label: "Admin", icon: Shield },
  ];

  // determine links for navigation based on user auth status
  const navigation = user ? userLinks : guestLinks;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* logo takes you home */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              <h1 className="text-slate-900 font-semibold text-lg">
                Expense Tracker
              </h1>
            </Link>
          </div>

          {/* nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-auto mr-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="gap-2"
                >
                  <Link to={item.path}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* auth buttons (no icons) */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
            {user ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

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
  );
}
