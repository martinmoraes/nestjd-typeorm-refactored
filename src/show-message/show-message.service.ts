import { Injectable } from '@nestjs/common';

@Injectable()
export class ShowMessageService {
  showMessage(): string {
    return 'Hoje é um belo dia';
  }
}
