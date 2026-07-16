import { Injectable } from "@nestjs/common";

type LogLevel = "debug" | "error" | "info" | "warn";

export type StructuredLogRecord = {
  durationMs?: number;
  errorMessage?: string;
  errorName?: string;
  event: string;
  handler?: string;
  httpMethod?: string;
  level: LogLevel;
  message: string;
  path?: string;
  requestId?: string;
  sessionId: string | null;
  statusCode?: number;
  systemName: string;
  timestamp?: string;
  userId: string | null;
};

@Injectable()
export class StructuredLoggerService {
  log(record: StructuredLogRecord): void {
    process.stdout.write(
      `${JSON.stringify({
        timestamp: record.timestamp ?? new Date().toISOString(),
        level: record.level,
        event: record.event,
        message: record.message,
        systemName: record.systemName,
        userId: record.userId,
        sessionId: record.sessionId,
        requestId: record.requestId,
        httpMethod: record.httpMethod,
        path: record.path,
        handler: record.handler,
        statusCode: record.statusCode,
        durationMs: record.durationMs,
        errorName: record.errorName,
        errorMessage: record.errorMessage
      })}\n`
    );
  }
}
