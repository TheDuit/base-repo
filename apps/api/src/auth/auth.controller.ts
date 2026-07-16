import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";

import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";
import { AuthService } from "./auth.service";
import { getAuthCookieName, getAuthCookieOptions } from "./cookie-config";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./presenters/login-response.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Public()
  @Post("login")
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(input);
    response.cookie(
      getAuthCookieName(this.config),
      result.accessToken,
      getAuthCookieOptions(this.config, result.expiresIn)
    );

    return LoginResponseDto.withoutAccessToken(result);
  }

  @Get("session")
  async session(@CurrentUser() user: AuthenticatedUser): Promise<LoginResponseDto> {
    return this.authService.getSession(user);
  }

  @Public()
  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response): { ok: true } {
    response.clearCookie(
      getAuthCookieName(this.config),
      getAuthCookieOptions(this.config)
    );

    return { ok: true };
  }
}
