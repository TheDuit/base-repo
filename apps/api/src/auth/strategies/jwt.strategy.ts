import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
