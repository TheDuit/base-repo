import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AllPermissions, UserPermissions } from "./user-permissions";
import { User } from "./user";
import { UserProfile, UserStatus } from "../entities/user.entity";

function makeUser(overrides: Partial<Parameters<typeof User.create>[0]> = {}) {
  return User.create({
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    deletedAt: null,
    displayName: "Admin",
    email: "ADMIN@EXAMPLE.COM",
    id: "user-1",
    isBackofficeAdmin: false,
    lastLoginAt: null,
    passwordChangedAt: null,
    permissions: [UserPermissions.UsersRead],
    profile: UserProfile.Admin,
    status: UserStatus.Active,
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides
  });
}

void describe("User", () => {
  void it("normaliza email e permissoes", () => {
    const user = makeUser({
      permissions: ["users.read", "users.read", ""]
    });

    assert.equal(user.email, "admin@example.com");
    assert.deepEqual(user.permissions, ["users.read"]);
  });

  void it("permite backoffice admin acessar todas as permissoes", () => {
    const user = makeUser({
      isBackofficeAdmin: true,
      permissions: [AllPermissions],
      profile: UserProfile.BackofficeAdmin
    });

    assert.equal(user.hasPermission("anything"), true);
  });
});
