"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthSessionProvider } from "../features/auth/auth-session-context";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#166534"
    },
    secondary: {
      main: "#334155"
    },
    background: {
      default: "#f6f7f9"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthSessionProvider>{children}</AuthSessionProvider>
      <ToastContainer newestOnTop position="top-right" />
    </ThemeProvider>
  );
}
