import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import type { Request, Response } from "express";

import type { AuthenticatedUser } from "../../auth/strategies/jwt.strategy";
import { SystemContextService } from "../../system/system-context.service";
import { StructuredLoggerService } from "./structured-logger.service";

type RequestWithUser = Request & {
  requestId?: string;
  requestStartedAt?: number;
  user?: AuthenticatedUser;
};

@Catch()
export class HttpExceptionLoggingFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    httpAdapterHost: HttpAdapterHost,
    private readonly logger: StructuredLoggerService,
    private readonly systemContext: SystemContextService
  ) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() === "http") {
      const request = host.switchToHttp().getRequest<RequestWithUser>();
      const response = host.switchToHttp().getResponse<Response>();
      const user = request.user;

      this.logger.log({
        durationMs: Date.now() - (request.requestStartedAt ?? Date.now()),
        errorMessage: this.resolveErrorMessage(exception),
        errorName: this.resolveErrorName(exception),
        event: "http_request_failed",
        httpMethod: request.method,
        level: "error",
        message: "HTTP request failed",
        path: request.originalUrl ?? request.url,
        requestId: request.requestId,
        sessionId: user?.sessionId ?? null,
        statusCode: this.resolveStatusCode(exception, response),
        systemName: this.systemContext.systemName,
        userId: user?.sub ?? null
      });
    }

    super.catch(exception, host);
  }

  private resolveStatusCode(exception: unknown, response: Response): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return response.statusCode >= 400 ? response.statusCode : 500;
  }

  private resolveErrorName(exception: unknown): string {
    return exception instanceof Error ? exception.name : "UnknownError";
  }

  private resolveErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === "object" && response && "message" in response) {
        const message = (response as { message?: unknown }).message;
        return Array.isArray(message) ? message.join("; ") : String(message);
      }
      return exception.message;
    }

    return exception instanceof Error ? exception.message : "Unknown error";
  }
}
