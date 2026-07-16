import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { AuthenticatedUser } from "../../auth/strategies/jwt.strategy";
import { hashPassword, verifyPassword } from "../../database/password-hasher";
import { AllPermissions, UserPermissions } from "./domain/user-permissions";
import { User } from "./domain/user";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity, UserProfile, UserStatus } from "./entities/user.entity";

export type BackofficeAdminBootstrapResult = {
  created: boolean;
  email: string;
};

type EnsureBackofficeAdminInput = {
  email: string;
  name: string;
  password: string;
  rotatePassword: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly config: ConfigService
  ) {}

  async list(): Promise<User[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: "DESC" },
      take: 100
    });

    return users.map(this.toDomain);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toDomain(user);
  }

  async create(input: CreateUserDto, actor: AuthenticatedUser): Promise<User> {
    const profile = input.profile ?? UserProfile.Admin;
    this.assertCanManageProfile(actor, profile);

    const email = User.normalizeEmail(input.email);
    const existing = await this.usersRepository.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const entity = this.usersRepository.create({
      displayName: input.displayName.trim(),
      email,
      isBackofficeAdmin: profile === UserProfile.BackofficeAdmin,
      passwordChangedAt: new Date(),
      passwordHash: await hashPassword(input.password),
      permissions: this.resolvePermissions(profile, input.permissions),
      profile,
      status: input.status ?? UserStatus.Active
    });

    return this.toDomain(await this.usersRepository.save(entity));
  }

  async update(
    id: string,
    input: UpdateUserDto,
    actor: AuthenticatedUser
  ): Promise<User> {
    const entity = await this.getEntityOrThrow(id);
    const nextProfile = input.profile ?? entity.profile;

    this.assertCanManageProfile(actor, nextProfile);

    if (input.email !== undefined) {
      entity.email = User.normalizeEmail(input.email);
    }
    if (input.displayName !== undefined) {
      entity.displayName = input.displayName.trim();
    }
    if (input.password !== undefined) {
      entity.passwordHash = await hashPassword(input.password);
      entity.passwordChangedAt = new Date();
    }
    if (input.status !== undefined) {
      entity.status = input.status;
    }
    if (input.profile !== undefined) {
      entity.profile = input.profile;
      entity.isBackofficeAdmin = input.profile === UserProfile.BackofficeAdmin;
    }
    if (input.permissions !== undefined || input.profile !== undefined) {
      entity.permissions = this.resolvePermissions(
        entity.profile,
        input.permissions ?? entity.permissions
      );
    }

    try {
      return this.toDomain(await this.usersRepository.save(entity));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException("Email already registered");
      }
      throw error;
    }
  }

  async disable(id: string): Promise<User> {
    const entity = await this.getEntityOrThrow(id);

    if (entity.isBackofficeAdmin) {
      const activeBackofficeCount = await this.usersRepository.count({
        where: {
          isBackofficeAdmin: true,
          status: UserStatus.Active
        }
      });

      if (activeBackofficeCount <= 1) {
        throw new BadRequestException(
          "Cannot disable the last active back office admin"
        );
      }
    }

    entity.status = UserStatus.Disabled;
    return this.toDomain(await this.usersRepository.save(entity));
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const normalizedEmail = User.normalizeEmail(email);
    const entity = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("lower(user.email) = :email", { email: normalizedEmail })
      .andWhere("user.deleted_at IS NULL")
      .getOne();

    if (!entity || entity.status !== UserStatus.Active) {
      return null;
    }

    const isValid = await verifyPassword(password, entity.passwordHash);
    if (!isValid) {
      return null;
    }

    entity.lastLoginAt = new Date();
    await this.usersRepository.save(entity);

    return this.toDomain(entity);
  }

  async ensureBackofficeAdminFromEnv(): Promise<BackofficeAdminBootstrapResult> {
    const email = this.config.get<string>("ADMIN_EMAIL", "admin@base.local");
    const name = this.config.get<string>("ADMIN_NAME", "Back Office Admin");
    const password = this.config.get<string>("ADMIN_PASSWORD", "admin123");
    const rotatePassword =
      this.config.get<string>("ADMIN_ROTATE_PASSWORD") === "true";

    return this.ensureBackofficeAdmin({
      email,
      name,
      password,
      rotatePassword
    });
  }

  async ensureBackofficeAdmin(
    input: EnsureBackofficeAdminInput
  ): Promise<BackofficeAdminBootstrapResult> {
    const email = User.normalizeEmail(input.email);
    const existing = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("lower(user.email) = :email", { email })
      .andWhere("user.deleted_at IS NULL")
      .getOne();

    if (existing) {
      existing.displayName = input.name.trim();
      existing.profile = UserProfile.BackofficeAdmin;
      existing.isBackofficeAdmin = true;
      existing.permissions = [AllPermissions];
      existing.status = UserStatus.Active;

      if (input.rotatePassword) {
        existing.passwordHash = await hashPassword(input.password);
        existing.passwordChangedAt = new Date();
      }

      await this.usersRepository.save(existing);
      return { created: false, email };
    }

    await this.usersRepository.save(
      this.usersRepository.create({
        displayName: input.name.trim(),
        email,
        isBackofficeAdmin: true,
        passwordChangedAt: new Date(),
        passwordHash: await hashPassword(input.password),
        permissions: [AllPermissions],
        profile: UserProfile.BackofficeAdmin,
        status: UserStatus.Active
      })
    );

    return { created: true, email };
  }

  private async getEntityOrThrow(id: string): Promise<UserEntity> {
    const entity = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.id = :id", { id })
      .andWhere("user.deleted_at IS NULL")
      .getOne();

    if (!entity) {
      throw new NotFoundException("User not found");
    }

    return entity;
  }

  private assertCanManageProfile(
    actor: AuthenticatedUser,
    profile: UserProfile
  ): void {
    if (profile === UserProfile.BackofficeAdmin && actor.isBackofficeAdmin !== true) {
      throw new ForbiddenException(
        "Only back office admins can manage back office admin users"
      );
    }
  }

  private resolvePermissions(
    profile: UserProfile,
    requestedPermissions: string[] | undefined
  ): string[] {
    if (profile === UserProfile.BackofficeAdmin) {
      return [AllPermissions];
    }

    const defaultAdminPermissions = [
      UserPermissions.UsersDisable,
      UserPermissions.UsersRead,
      UserPermissions.UsersWrite
    ];

    return User.normalizePermissions(requestedPermissions ?? defaultAdminPermissions);
  }

  private toDomain(entity: UserEntity): User {
    return User.create({
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      displayName: entity.displayName,
      email: entity.email,
      id: entity.id,
      isBackofficeAdmin: entity.isBackofficeAdmin,
      lastLoginAt: entity.lastLoginAt,
      passwordChangedAt: entity.passwordChangedAt,
      permissions: entity.permissions ?? [],
      profile: entity.profile,
      status: entity.status,
      updatedAt: entity.updatedAt
    });
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
