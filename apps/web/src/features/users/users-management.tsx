"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Plus, RefreshCw } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { appConfig } from "../../config/app-config";
import { useAuthSession } from "../auth/auth-session-context";
import { notify } from "../notifications/toast";

type UserItem = {
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  isBackofficeAdmin: boolean;
  permissions: string[];
  profile: "admin" | "backoffice_admin";
  status: string;
};

type FormState = {
  displayName: string;
  email: string;
  password: string;
  profile: "admin" | "backoffice_admin";
};

const emptyForm: FormState = {
  displayName: "",
  email: "",
  password: "",
  profile: "admin"
};

export function UsersManagement() {
  const { logout, session } = useAuthSession();
  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const loadUsers = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    const response = await fetch(`${appConfig.apiUrl}/users`, {
      credentials: "include"
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      notify("Nao foi possivel carregar usuarios.", "error");
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as { items: UserItem[] };
    setItems(payload.items);
    setIsLoading(false);
  }, [logout, session]);

  useEffect(() => {
    void Promise.resolve().then(loadUsers);
  }, [loadUsers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    const response = await fetch(`${appConfig.apiUrl}/users`, {
      body: JSON.stringify(form),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      notify("Nao foi possivel criar o usuario.", "error");
      return;
    }

    notify("Usuario criado.");
    setForm(emptyForm);
    setIsDialogOpen(false);
    await loadUsers();
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography component="h1" variant="h4">
            Usuarios
          </Typography>
          <Typography color="text.secondary">
            Controle inicial de admins e backoffice admins.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => void loadUsers()}
            startIcon={<RefreshCw size={17} />}
            variant="outlined"
          >
            Atualizar
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            startIcon={<Plus size={17} />}
            variant="contained"
          >
            Novo usuario
          </Button>
        </Stack>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.profile}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
            {!isLoading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Nenhum usuario cadastrado.</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setIsDialogOpen(false)}
        open={isDialogOpen}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Novo usuario</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Nome"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    displayName: event.target.value
                  }))
                }
                required
                value={form.displayName}
              />
              <TextField
                label="Email"
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
                type="email"
                value={form.email}
              />
              <TextField
                label="Senha inicial"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value
                  }))
                }
                required
                type="password"
                value={form.password}
              />
              <TextField
                label="Tipo"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    profile: event.target.value as FormState["profile"]
                  }))
                }
                select
                value={form.profile}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="backoffice_admin">Backoffice admin</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Criar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
