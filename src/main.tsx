import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/AuthContext";

// create query client for react query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
