import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../../auth/decorators/permissions.decorator";
import type { AuthenticatedUser } from "../../auth/strategies/jwt.strategy";
import { UserPermissions } from "./domain/user-permissions";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./presenters/user-response.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(UserPermissions.UsersRead)
  async list(): Promise<{ items: UserResponseDto[] }> {
    const users = await this.usersService.list();

    return {
      items: users.map(UserResponseDto.fromDomain)
    };
  }

  @Get(":id")
  @RequirePermissions(UserPermissions.UsersRead)
  async findById(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromDomain(await this.usersService.findById(id));
  }

  @Post()
  @RequirePermissions(UserPermissions.UsersWrite)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: CreateUserDto
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromDomain(await this.usersService.create(input, user));
  }

  @Patch(":id")
  @RequirePermissions(UserPermissions.UsersWrite)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() input: UpdateUserDto
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromDomain(
      await this.usersService.update(id, input, user)
    );
  }

  @Post(":id/disable")
  @RequirePermissions(UserPermissions.UsersDisable)
  async disable(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromDomain(await this.usersService.disable(id));
  }
}
