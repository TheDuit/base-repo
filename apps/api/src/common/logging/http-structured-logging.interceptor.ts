import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import type { Request, Response } from "express";
import { tap } from "rxjs";

import type { AuthenticatedUser } from "../../auth/strategies/jwt.strategy";
import { SystemContextService } from "../../system/system-context.service";
import { StructuredLoggerService } from "./structured-logger.service";

type RequestWithUser = Request & {
  requestId?: string;
  requestStartedAt?: number;
  user?: AuthenticatedUser;
};

@Injectable()
export class HttpStructuredLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: StructuredLoggerService,
    private readonly systemContext: SystemContextService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = request.requestStartedAt ?? Date.now();
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          durationMs: Date.now() - startedAt,
          event: "http_request_completed",
          handler: `${context.getClass().name}.${context.getHandler().name}`,
          httpMethod: request.method,
          level: "info",
          message: "HTTP request completed",
          path: request.originalUrl ?? request.url,
          requestId: request.requestId,
          sessionId: user?.sessionId ?? null,
          statusCode: response.statusCode,
          systemName: this.systemContext.systemName,
          userId: user?.sub ?? null
        });
      })
    );
  }
}
