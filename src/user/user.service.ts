import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(userDTO: CreateUserDTO) {
    const existsEmail = await this.usersRepository.exist({
      where: {
        email: userDTO.email,
      },
    });

    if (existsEmail) {
      throw new BadRequestException(`E-Mail ${userDTO.email}, já cadastrado.`);
    }

    const user = this.usersRepository.create(userDTO);
    return this.usersRepository.save(user);
  }

  async update(id: number, userDTO: UpdateUserDTO) {
    await this.existsID(id);
    await this.checkEmailWithID(userDTO.email, id);

    const updated = await this.usersRepository.update(id, userDTO);

    return { id, updated: updated.affected > 0 };
  }

  async list() {
    const users = await this.usersRepository.find();

    return { users };
  }

  async show(id: number) {
    const user = await this.usersRepository.find({
      where: {
        id,
      },
    });

    console.log(user);

    this.userNotFound(id, user.length);

    return { user };
  }

  async delete(id: number) {
    const deleted = await this.usersRepository.delete(id);

    this.userNotFound(id, !deleted.affected);

    return {
      id,
      affected: deleted.affected > 0,
    };
  }

  async existsID(id: number) {
    const exist = await this.usersRepository.exist({
      where: {
        id,
      },
    });

    this.userNotFound(id, exist);

    return exist;
  }

  async checkEmailWithID(email: string, id: number) {
    const existEmailWithID = await this.usersRepository.exist({
      where: {
        id,
        email,
      },
    });

    if (!existEmailWithID) {
      throw new BadRequestException(`E-Mail ${email} já em uso.`);
    }
  }

  userNotFound(id: number, result: boolean | number) {
    if (!result) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }
  }
}
