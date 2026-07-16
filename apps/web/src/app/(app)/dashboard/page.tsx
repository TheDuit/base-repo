"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { appConfig } from "../../../config/app-config";
import { useAuthSession } from "../../../features/auth/auth-session-context";

export default function DashboardPage() {
  const { session } = useAuthSession();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h4">
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Base administrativa de {appConfig.displayName}.
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography gutterBottom sx={{ fontWeight: 700 }}>
          Sessao ativa
        </Typography>
        <Typography color="text.secondary">
          Usuario: {session?.user.displayName} ({session?.user.profile})
        </Typography>
      </Paper>
    </Stack>
  );
}
