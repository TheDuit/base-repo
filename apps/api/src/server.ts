import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { randomUUID } from "node:crypto";

import { AppModule } from "./app.module";

export async function createNestApplication() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(
    (
      request: Request & { requestId?: string; requestStartedAt?: number },
      _response: Response,
      next: NextFunction
    ) => {
      request.requestId =
        request.header("x-request-id") ??
        request.header("x-amzn-requestid") ??
        request.header("x-amzn-trace-id") ??
        randomUUID();
      request.requestStartedAt = Date.now();
      next();
    }
  );
  app.use(helmet());
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","),
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  return app;
}
