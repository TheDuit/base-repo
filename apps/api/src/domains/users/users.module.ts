import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BackofficeAdminBootstrapService } from "./backoffice-admin-bootstrap.service";
import { UserEntity } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [BackofficeAdminBootstrapService, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
