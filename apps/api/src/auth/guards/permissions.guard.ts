import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { REQUIRED_PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import type { AuthenticatedUser } from "../strategies/jwt.strategy";

const ALL_PERMISSIONS = "*";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const permissions = request.user?.permissions ?? [];

    return (
      request.user?.isBackofficeAdmin === true ||
      permissions.includes(ALL_PERMISSIONS) ||
      required.every((permission) => permissions.includes(permission))
    );
  }
}
