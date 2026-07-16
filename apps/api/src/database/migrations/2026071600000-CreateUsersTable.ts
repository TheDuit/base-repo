import { MigrationInterface, QueryRunner } from "typeorm";

import { hashPassword } from "../password-hasher";

export class CreateUsersTable2026071600000 implements MigrationInterface {
  name = "CreateUsersTable2026071600000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(320) NOT NULL,
        display_name varchar(160) NOT NULL,
        password_hash varchar(255) NOT NULL,
        profile varchar(40) NOT NULL,
        status varchar(30) NOT NULL DEFAULT 'active',
        is_backoffice_admin boolean NOT NULL DEFAULT false,
        permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
        last_login_at timestamptz,
        password_changed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        CONSTRAINT users_profile_check CHECK (
          profile IN ('admin', 'backoffice_admin')
        ),
        CONSTRAINT users_status_check CHECK (
          status IN ('active', 'invited', 'suspended', 'disabled')
        )
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique
      ON users (lower(email))
      WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS users_profile_status_idx
      ON users (profile, status)
      WHERE deleted_at IS NULL
    `);

    await this.ensureBackofficeAdmin(queryRunner);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS users_profile_status_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS users_email_lower_unique`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }

  private async ensureBackofficeAdmin(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const displayName = process.env.ADMIN_NAME?.trim() || "Back Office Admin";
    const appEnv = process.env.APP_ENV ?? "local";

    if (!email) {
      throw new Error("ADMIN_EMAIL is required to create the initial admin");
    }

    if (!password) {
      throw new Error("ADMIN_PASSWORD is required to create the initial admin");
    }

    if (appEnv !== "local" && password.length < 12) {
      throw new Error(
        "ADMIN_PASSWORD must have at least 12 characters outside local environments"
      );
    }

    const now = new Date();
    const passwordHash = await hashPassword(password);

    await queryRunner.query(
      `
        INSERT INTO users (
          email,
          display_name,
          password_hash,
          profile,
          status,
          is_backoffice_admin,
          permissions,
          password_changed_at,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, 'backoffice_admin', 'active', true, $4::jsonb, $5, $6, $7)
        ON CONFLICT (lower(email))
        WHERE deleted_at IS NULL
        DO UPDATE SET
          display_name = EXCLUDED.display_name,
          profile = EXCLUDED.profile,
          status = EXCLUDED.status,
          is_backoffice_admin = EXCLUDED.is_backoffice_admin,
          permissions = EXCLUDED.permissions,
          password_hash = EXCLUDED.password_hash,
          password_changed_at = EXCLUDED.password_changed_at,
          updated_at = EXCLUDED.updated_at
      `,
      [email, displayName, passwordHash, JSON.stringify(["*"]), now, now, now]
    );
  }
}
