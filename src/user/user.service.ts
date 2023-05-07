import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UserTypeORMRepository } from '../adapters/repository/typeorm/user-typeorm.repository';
import { ShowMessageService } from '../show-message/show-message.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly usersRepository: UserTypeORMRepository,
    private readonly message: ShowMessageService,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<Record<string, any>> {
    const existsEmail = await this.usersRepository.existsEMail(userDTO.email);

    if (existsEmail) {
      const message = `E-Mail ${userDTO.email}, já cadastrado.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    return this.usersRepository.create(userDTO);
  }

  async update(
    id: number,
    userDTO: UpdateUserDTO,
  ): Promise<{ id: number; realized: boolean }> {
    const existsID = await this.usersRepository.existsID(id);
    if (existsID) {
      this.userNotFound(id, existsID);
    }

    const existsEmailEndID = await this.usersRepository.existsEmailWithID(
      userDTO.email,
      id,
    );
    if (!existsEmailEndID) {
      const message = `E-Mail ${userDTO.email} já em uso.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const updated = await this.usersRepository.update(id, userDTO);

    return updated;
  }

  async list(): Promise<Record<string, any>[]> {
    const users = await this.usersRepository.findAll();

    return users;
  }

  async show(id: number): Promise<Record<string, any>[]> {
    const user = await this.usersRepository.findID(id);

    this.userNotFound(id, user.length);

    return user;
  }

  async delete(id: number): Promise<{ id: number; realized: boolean }> {
    const deleted = await this.usersRepository.delete(id);

    this.userNotFound(id, !deleted.realized);

    return deleted;
  }

  userNotFound(id: number, result: boolean | number) {
    if (!result) {
      const message = `Usuário ${id} não encontrado.`;
      this.logger.error(message);
      throw new NotFoundException(message);
    }
  }

  showMessage(): {
    time: number;
    messageReceived: string;
  } {
    const messageReceived = this.message.showMessage();
    return {
      time: new Date().getTime(),
      messageReceived,
    };
  }
}
