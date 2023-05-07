import { Module } from '@nestjs/common';
import { ShowMessageService } from './show-message.service';

@Module({
  providers: [ShowMessageService],
  exports: [ShowMessageService],
})
export class ShowMessageModule {}
