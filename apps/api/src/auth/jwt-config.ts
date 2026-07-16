import { ConfigService } from "@nestjs/config";

export function getJwtExpiresInSeconds(config: ConfigService): number {
  const value = Number(config.get<string>("JWT_EXPIRES_IN_SECONDS", "3600"));

  return Number.isFinite(value) && value > 0 ? value : 3600;
}
