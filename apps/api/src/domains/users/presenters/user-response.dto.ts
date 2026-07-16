import { User } from "../domain/user";

export class UserResponseDto {
  createdAt!: string;
  displayName!: string;
  email!: string;
  id!: string;
  isBackofficeAdmin!: boolean;
  lastLoginAt!: string | null;
  passwordChangedAt!: string | null;
  permissions!: string[];
  profile!: string;
  status!: string;
  updatedAt!: string;

  static fromDomain(user: User): UserResponseDto {
    return {
      createdAt: user.createdAt.toISOString(),
      displayName: user.displayName,
      email: user.email,
      id: user.id,
      isBackofficeAdmin: user.isBackofficeAdmin,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,
      permissions: user.permissions,
      profile: user.profile,
      status: user.status,
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
