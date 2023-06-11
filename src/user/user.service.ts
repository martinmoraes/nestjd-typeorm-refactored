import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { ShowMessageService } from '../show-message/show-message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserInterfaceCreated } from './interface/user-interface-created';
import { Transform, instanceToPlain, plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly message: ShowMessageService,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<UserInterfaceCreated> {
    const existsEmail = await this.existsEMail(userDTO.email);

    if (existsEmail) {
      const message = `E-Mail ${userDTO.email}, já cadastrado.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const userEntity: UserEntity = plainToClass(UserEntity, userDTO);

    const userCreated: UserEntity = this.usersRepository.create(userEntity);

    const userSaved: UserEntity = await this.usersRepository.save(userCreated);
    console.log(userSaved);

    this.logger.log('Usuário criado registro.');
    return instanceToPlain<UserEntity>(userSaved) as UserInterfaceCreated;
  }

  async update(
    id: number,
    userDTO: UpdateUserDTO,
  ): Promise<{ id: number; realized: boolean }> {
    const existsID = await this.existsID(id);

    if (!existsID) {
      this.userNotFound(id, existsID);
    }

    const receivedUser = await this.findByEMail(userDTO.email);

    if (receivedUser.length > 0 && receivedUser[0].id !== id) {
      const message = `E-Mail ${userDTO.email} já em uso.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const userEntity = plainToClass(UserEntity, userDTO);
    const updated = await this.usersRepository.update(id, userEntity);
    console.log(updated);

    return { id, realized: updated.affected > 0 };
  }

  async list(): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersRepository.find();
    const userPlain = instanceToPlain<UserEntity>(usersEntity);

    return userPlain as UserInterfaceCreated[];
  }

  async show(id: number): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersRepository.find({
      where: {
        id,
      },
    });

    this.userNotFound(id, usersEntity.length);

    return instanceToPlain<UserEntity>(usersEntity) as UserInterfaceCreated[];
  }

  async delete(id: number): Promise<{ id: number; realized: boolean }> {
    const deleted = await this.usersRepository.delete(id);

    this.userNotFound(id, deleted.affected);

    return { id, realized: deleted.affected > 0 };
  }

  private userNotFound(id: number, result: boolean | number) {
    if (!result) {
      const message = `Usuário ${id} não encontrado.`;
      this.logger.error(message);
      throw new NotFoundException(message);
    }
  }

  private async existsID(id: number): Promise<boolean> {
    return this.usersRepository.exist({
      where: {
        id,
      },
    });
  }

  private async existsEMail(email: string): Promise<boolean> {
    return this.usersRepository.exist({
      where: {
        email,
      },
    });
  }

  private async existsEmailWithID(email: string, id: number): Promise<boolean> {
    return this.usersRepository.exist({
      where: {
        id,
        email,
      },
    });
  }

  private async findByEMail(email: string): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersRepository.find({
      where: {
        email,
      },
    });

    return instanceToPlain<UserEntity>(usersEntity) as UserInterfaceCreated[];
  }

  showMessage(): {
    time: number;
    messageReceived: string;
  } {
    return {
      time: new Date().getTime(),
      messageReceived: `${this.message.showMessage()} e Port é ${this.configService.get<string>(
        'APP_PORT',
      )}`,
    };
  }
}
