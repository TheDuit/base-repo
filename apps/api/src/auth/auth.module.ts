import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from "../domains/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { getJwtExpiresInSeconds } from "./jwt-config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET", "local-development-secret-change-me"),
        signOptions: {
          expiresIn: getJwtExpiresInSeconds(config)
        }
      })
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
