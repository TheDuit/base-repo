import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "./decorators/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./presenters/login-response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() input: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(input);
  }
}
