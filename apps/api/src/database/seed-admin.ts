import { AppDataSource } from "./data-source";
import { hashPassword } from "./password-hasher";
import { UserEntity, UserProfile, UserStatus } from "../domains/users/entities/user.entity";
import { AllPermissions } from "../domains/users/domain/user-permissions";

async function seed() {
  await AppDataSource.initialize();

  const email = (process.env.ADMIN_EMAIL ?? "admin@base.local").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const displayName = process.env.ADMIN_NAME ?? "Back Office Admin";
  const users = AppDataSource.getRepository(UserEntity);
  const existing = await users
    .createQueryBuilder("user")
    .addSelect("user.passwordHash")
    .where("lower(user.email) = :email", { email })
    .getOne();

  if (existing) {
    existing.displayName = displayName;
    existing.passwordHash = await hashPassword(password);
    existing.profile = UserProfile.BackofficeAdmin;
    existing.isBackofficeAdmin = true;
    existing.permissions = [AllPermissions];
    existing.status = UserStatus.Active;
    await users.save(existing);
  } else {
    await users.save(
      users.create({
        displayName,
        email,
        passwordHash: await hashPassword(password),
        profile: UserProfile.BackofficeAdmin,
        isBackofficeAdmin: true,
        permissions: [AllPermissions],
        status: UserStatus.Active,
        passwordChangedAt: new Date()
      })
    );
  }

  await AppDataSource.destroy();
}

void seed();
