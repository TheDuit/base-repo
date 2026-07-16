"use client";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { appConfig } from "../../config/app-config";
import { useAuthSession } from "../../features/auth/auth-session-context";
import { notify } from "../../features/notifications/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthSession();
  const [email, setEmail] = useState("admin@base.local");
  const [password, setPassword] = useState("admin123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Nao foi possivel entrar.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2
      }}
    >
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: 420 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography component="h1" variant="h5">
              {appConfig.displayName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Acesse o painel administrativo.
            </Typography>
          </Box>
          <TextField
            autoComplete="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <TextField
            autoComplete="current-password"
            label="Senha"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <Button disabled={isSubmitting} type="submit" variant="contained">
            Entrar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
