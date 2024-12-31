import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { IsUserAlreadyExist } from '@modules/user/validators/is-user-already-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService, IsUserAlreadyExist, Logger],
  exports: [UserService],
})
export class UserModule {}
