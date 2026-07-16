import { User } from "../../domains/users/domain/user";
import { UserResponseDto } from "../../domains/users/presenters/user-response.dto";

export class LoginResponseDto {
  displayName!: string;
  expiresIn!: number;
  sessionId!: string;
  systemName!: string;
  user!: UserResponseDto;

  static withoutAccessToken(input: LoginResponseDto & { accessToken?: string }): LoginResponseDto {
    return {
      displayName: input.displayName,
      expiresIn: input.expiresIn,
      sessionId: input.sessionId,
      systemName: input.systemName,
      user: input.user
    };
  }

  static create(input: {
    accessToken?: string;
    displayName: string;
    expiresIn: number;
    sessionId: string;
    systemName: string;
    user: User;
  }): LoginResponseDto & { accessToken?: string } {
    return {
      ...(input.accessToken ? { accessToken: input.accessToken } : {}),
      displayName: input.displayName,
      expiresIn: input.expiresIn,
      sessionId: input.sessionId,
      systemName: input.systemName,
      user: UserResponseDto.fromDomain(input.user)
    };
  }
}
