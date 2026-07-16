import { User } from "../../domains/users/domain/user";
import { UserResponseDto } from "../../domains/users/presenters/user-response.dto";

export class LoginResponseDto {
  accessToken!: string;
  displayName!: string;
  expiresIn!: number;
  sessionId!: string;
  systemName!: string;
  tokenType!: "Bearer";
  user!: UserResponseDto;

  static create(input: {
    accessToken: string;
    displayName: string;
    expiresIn: number;
    sessionId: string;
    systemName: string;
    user: User;
  }): LoginResponseDto {
    return {
      accessToken: input.accessToken,
      displayName: input.displayName,
      expiresIn: input.expiresIn,
      sessionId: input.sessionId,
      systemName: input.systemName,
      tokenType: "Bearer",
      user: UserResponseDto.fromDomain(input.user)
    };
  }
}
