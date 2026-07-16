import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length
} from "class-validator";

import { UserProfile, UserStatus } from "../entities/user.entity";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(1, 160)
  displayName!: string;

  @IsString()
  @Length(8, 200)
  password!: string;

  @IsOptional()
  @IsEnum(UserProfile)
  profile?: UserProfile;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissions?: string[];
}
