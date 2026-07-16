import { AllPermissions } from "./user-permissions";
import { UserProfile, UserStatus } from "../entities/user.entity";

export type UserProps = {
  createdAt: Date;
  deletedAt: Date | null;
  displayName: string;
  email: string;
  id: string;
  isBackofficeAdmin: boolean;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;
  permissions: string[];
  profile: UserProfile;
  status: UserStatus;
  updatedAt: Date;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User({
      ...props,
      email: User.normalizeEmail(props.email),
      permissions: User.normalizePermissions(props.permissions)
    });
  }

  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static normalizePermissions(permissions: string[]): string[] {
    return [...new Set(permissions.map((permission) => permission.trim()))].filter(
      Boolean
    );
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get profile(): UserProfile {
    return this.props.profile;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get isBackofficeAdmin(): boolean {
    return this.props.isBackofficeAdmin;
  }

  get permissions(): string[] {
    return this.props.permissions;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  get passwordChangedAt(): Date | null {
    return this.props.passwordChangedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  isActive(): boolean {
    return this.props.status === UserStatus.Active && this.props.deletedAt === null;
  }

  hasPermission(permission: string): boolean {
    return (
      this.props.isBackofficeAdmin ||
      this.props.permissions.includes(AllPermissions) ||
      this.props.permissions.includes(permission)
    );
  }
}
