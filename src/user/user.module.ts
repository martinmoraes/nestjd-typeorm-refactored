import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowMessageModule } from '../show-message/show-message.module';
import { UserEntity } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';

//TO DO - Achar um meio de desacoplar TypeORMConfigModule
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    ShowMessageModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
