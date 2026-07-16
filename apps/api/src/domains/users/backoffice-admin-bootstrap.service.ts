import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UsersService } from "./users.service";

@Injectable()
export class BackofficeAdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BackofficeAdminBootstrapService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get<string>("ADMIN_BOOTSTRAP_ON_STARTUP") !== "true") {
      return;
    }

    const result = await this.usersService.ensureBackofficeAdminFromEnv();

    this.logger.log(
      result.created
        ? `Back office admin created: ${result.email}`
        : `Back office admin already exists: ${result.email}`
    );
  }
}
