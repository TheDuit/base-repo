import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export enum UserProfile {
  Admin = "admin",
  BackofficeAdmin = "backoffice_admin"
}

export enum UserStatus {
  Active = "active",
  Disabled = "disabled",
  Invited = "invited",
  Suspended = "suspended"
}

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 320 })
  email!: string;

  @Column({ name: "display_name", type: "varchar", length: 160 })
  displayName!: string;

  @Column({ name: "password_hash", select: false, type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 40 })
  profile!: UserProfile;

  @Column({ default: UserStatus.Active, type: "varchar", length: 30 })
  status!: UserStatus;

  @Column({ name: "is_backoffice_admin", default: false, type: "boolean" })
  isBackofficeAdmin!: boolean;

  @Column({ default: [], type: "jsonb" })
  permissions!: string[];

  @Column({ name: "last_login_at", nullable: true, type: "timestamptz" })
  lastLoginAt!: Date | null;

  @Column({ name: "password_changed_at", nullable: true, type: "timestamptz" })
  passwordChangedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date | null;
}
