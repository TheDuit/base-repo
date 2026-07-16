"use client";

import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { LayoutDashboard, LogOut, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { appConfig } from "../../config/app-config";
import { useAuthSession } from "../../features/auth/auth-session-context";

const drawerWidth = 240;

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: UsersRound, label: "Usuarios" }
];

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, session } = useAuthSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{ borderBottom: "1px solid #e5e7eb", ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography variant="subtitle1">{appConfig.displayName}</Typography>
            <Typography color="text.secondary" variant="caption">
              {session?.user.displayName}
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            startIcon={<LogOut size={17} />}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        slotProps={{
          paper: {
            sx: {
              borderRight: "1px solid #e5e7eb",
              width: drawerWidth
            }
          }
        }}
        variant="permanent"
      >
        <Toolbar>
          <Typography sx={{ fontWeight: 700 }}>{appConfig.systemName}</Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = pathname === item.href;

            return (
              <ListItemButton
                component={Link}
                href={item.href}
                key={item.href}
                selected={selected}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flex: 1, p: 3, pt: 11 }}>
        {children}
      </Box>
    </Box>
  );
}
