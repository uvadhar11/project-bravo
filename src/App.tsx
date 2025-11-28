import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { About } from "./pages/About";
import { Credits } from "./pages/Credits";
import { Contact } from "./pages/Contact";
import { ExpenseLogging } from "./pages/ExpenseLogging";
import { ExpenseReport } from "./pages/ExpenseReport";
import { AdminWindow } from "./pages/AdminWindow";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { SetPassword } from "./pages/SetPassword";
import { Onboarding } from "./pages/Onboarding";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      {/* scroll to top utility to force scroll to top on move to a new page */}
      <ScrollToTop />

      {/* toast messages */}
      <Toaster />

      <Routes>
        {/* Public Routes (no layout or auth) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* public pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<Layout />}>
            <Route path="/expenses" element={<ExpenseLogging />} />
            <Route path="/reports" element={<ExpenseReport />} />
            <Route path="/admin" element={<AdminWindow />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
