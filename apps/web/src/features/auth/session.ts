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
  accessToken: string;
  displayName: string;
  expiresIn: number;
  sessionId: string;
  systemName: string;
  tokenType: "Bearer";
  user: SessionUser;
};
