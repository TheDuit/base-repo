export type SessionUser = {
  displayName: string;
  email: string;
  id: string;
  isBackofficeAdmin: boolean;
  permissions: string[];
  profile: string;
  status: string;
};

export type AuthSession = {
  displayName: string;
  expiresIn: number;
  sessionId: string;
  systemName: string;
  user: SessionUser;
};
