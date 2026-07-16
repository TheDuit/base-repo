import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "./auth/guards/permissions.guard";
import { HttpExceptionLoggingFilter } from "./common/logging/http-exception-logging.filter";
import { HttpStructuredLoggingInterceptor } from "./common/logging/http-structured-logging.interceptor";
import { StructuredLoggerService } from "./common/logging/structured-logger.service";
import { HealthModule } from "./domains/health/health.module";
import { UsersModule } from "./domains/users/users.module";
import { SystemModule } from "./system/system.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("POSTGRES_HOST", "localhost"),
        port: Number(config.get<string>("POSTGRES_PORT", "5432")),
        username: config.get<string>("POSTGRES_USER", "base_system"),
        password: config.get<string>("POSTGRES_PASSWORD", "base_system_local"),
        database: config.get<string>("POSTGRES_DB", "base_system"),
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          config.get<string>("POSTGRES_SSL") === "true"
            ? { rejectUnauthorized: false }
            : false
      })
    }),
    SystemModule,
    AuthModule,
    HealthModule,
    UsersModule
  ],
  providers: [
    StructuredLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpStructuredLoggingInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionLoggingFilter
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]
})
export class AppModule {}
