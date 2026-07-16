import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "node:crypto";

import { UsersService } from "../domains/users/users.service";
import { SystemContextService } from "../system/system-context.service";
import { LoginDto } from "./dto/login.dto";
import { getJwtExpiresInSeconds } from "./jwt-config";
import { LoginResponseDto } from "./presenters/login-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly systemContext: SystemContextService,
    private readonly usersService: UsersService
  ) {}

  async login(input: LoginDto): Promise<LoginResponseDto & { accessToken: string }> {
    const user = await this.usersService.validateCredentials(
      input.email,
      input.password
    );

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const expiresIn = getJwtExpiresInSeconds(this.config);
    const sessionId = randomUUID();
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        isBackofficeAdmin: user.isBackofficeAdmin,
        permissions: user.permissions,
        roles: [user.profile],
        sid: sessionId
      },
      { expiresIn }
    );

    return {
      ...LoginResponseDto.create({
        displayName: this.systemContext.displayName,
        expiresIn,
        sessionId,
        systemName: this.systemContext.systemName,
        user
      }),
      accessToken
    };
  }

  async getSession(user: { sessionId?: string; sub: string }): Promise<LoginResponseDto> {
    const sessionUser = await this.usersService.findById(user.sub);

    return LoginResponseDto.create({
      displayName: this.systemContext.displayName,
      expiresIn: getJwtExpiresInSeconds(this.config),
      sessionId: user.sessionId ?? "",
      systemName: this.systemContext.systemName,
      user: sessionUser
    });
  }
}
