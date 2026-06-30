export interface AdminSession {
  id: string;
  token: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface AdminAccount {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  providerId: string;
  accountId: string;
  scope: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
