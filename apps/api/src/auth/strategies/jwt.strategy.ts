import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { getAuthCookieName } from "../cookie-config";

export type AuthenticatedUser = {
  email?: string;
  isBackofficeAdmin?: boolean;
  permissions?: string[];
  roles?: string[];
  sessionId?: string;
  sid?: string;
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(getAuthCookieName(config)),
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET", "local-development-secret-change-me")
    });
  }

  validate(payload: AuthenticatedUser): AuthenticatedUser {
    return {
      sub: payload.sub,
      email: payload.email,
      isBackofficeAdmin: payload.isBackofficeAdmin ?? false,
      permissions: payload.permissions ?? [],
      roles: payload.roles ?? [],
      sessionId: payload.sessionId ?? payload.sid
    };
  }
}

function cookieExtractor(cookieName: string) {
  return (request: Request | undefined): string | null => {
    if (!request?.headers.cookie) {
      return null;
    }

    const cookies = request.headers.cookie.split(";");
    for (const cookie of cookies) {
      const [name, ...valueParts] = cookie.trim().split("=");
      if (name === cookieName) {
        return decodeURIComponent(valueParts.join("="));
      }
    }

    return null;
  };
}
