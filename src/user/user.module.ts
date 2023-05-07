import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeORMConfigModule } from '../adapters/repository/typeorm/typeorm-config.model';
import { ShowMessageModule } from '../show-message/show-message.module';

//TO DO - Achar um meio de desacoplar TypeORMConfigModule
@Module({
  imports: [TypeORMConfigModule, ShowMessageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
