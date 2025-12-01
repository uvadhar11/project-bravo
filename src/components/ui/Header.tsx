import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./button";
import {
  Menu,
  Wallet,
  BarChart3,
  Shield,
  Info,
  Award,
  Mail,
  LogOut,
  UserCircle,
  Building2,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";
import { useUserProfile } from "../../features/auth/useUserProfile";
import { useOrganization } from "../../features/admin/useAdmin";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: profile } = useUserProfile(); // get user profile data
  const { data: org } = useOrganization(); // get org data

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const guestLinks = [
    { path: "/about", label: "About", icon: Info },
    { path: "/credits", label: "Credits", icon: Award },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const userLinks = [
    { path: "/expenses", label: "Dashboard", icon: Wallet },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    ...(profile?.role === "admin"
      ? [{ path: "/admin", label: "Admin", icon: Shield }]
      : []),
  ];

  const navigation = user ? userLinks : guestLinks;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* LEFT SIDE: Brand & Context */}
          <div className="flex items-center gap-4">
            {/*  Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Project Bravo Logo"
                className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:opacity-90 transition-opacity"
              />
              <span className="text-slate-900 font-medium text-lg tracking-tight hidden sm:block">
                Expense Tracker
              </span>
            </Link>

            {/* Vertical Separator between logo and org pill */}
            {org?.name && (
              <div className="h-6 w-px bg-slate-200 rotate-12 mx-1 hidden sm:block" />
            )}

            {/* current organization pill */}
            {org?.name && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full transition-colors hover:border-blue-200 hover:bg-blue-50/50 cursor-default">
                <div className="bg-white p-0.5 rounded-full border border-slate-100 shadow-sm">
                  <Building2 className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">
                  {org.name}
                </span>
                {/* chevron in case we want users to be in multiple orgs in the future*/}
                {/* <ChevronDown className="w-3 h-3 text-slate-400" /> */}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Desktop Nav */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    // We use "ghost" for both but style them manually for full control
                    variant="ghost"
                    asChild
                    className={`gap-2 h-9 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-200/50"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Link to={item.path}>
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            {/* Auth User Profile */}
            <div className="hidden md:flex items-center pl-4 border-l border-slate-200 gap-3">
              {user ? (
                <>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium text-slate-900 leading-none">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                      {profile?.role || "Member"}
                    </p>
                  </div>

                  <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm ring-2 ring-white">
                    {profile?.full_name?.[0]?.toUpperCase() || (
                      <UserCircle className="w-5 h-5" />
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1 rounded-full"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col gap-1">
              {/* Show Org Name in Mobile Menu if visible */}
              {org?.name && (
                <div className="px-4 py-2 mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {org.name}
                    </span>
                  </div>
                </div>
              )}

              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className={`w-full justify-start gap-3 ${
                      isActive ? "bg-blue-50 text-blue-700" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to={item.path}>
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-blue-600" : "text-slate-400"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}

              {user && (
                <>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {profile?.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {profile?.full_name}
                      </p>
                      <p className="text-xs text-slate-500">{profile?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
