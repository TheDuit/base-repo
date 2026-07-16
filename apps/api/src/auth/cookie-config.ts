import type { CookieOptions } from "express";

import { ConfigService } from "@nestjs/config";

export function getAuthCookieName(config: ConfigService): string {
  return config.get<string>("AUTH_COOKIE_NAME", "base_system_session");
}

export function getAuthCookieOptions(
  config: ConfigService,
  maxAgeSeconds?: number
): CookieOptions {
  const secure = config.get<string>("AUTH_COOKIE_SECURE") === "true";
  const sameSite = config.get<"lax" | "none" | "strict">(
    "AUTH_COOKIE_SAME_SITE",
    secure ? "none" : "lax"
  );

  return {
    httpOnly: true,
    maxAge: maxAgeSeconds === undefined ? undefined : maxAgeSeconds * 1000,
    path: "/api",
    sameSite,
    secure
  };
}
