import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../../../user/dto/create-user-dto';
import { UpdateUserDTO } from '../../../user/dto/update-user-dto';
import { UserInterfaceRepository } from '../../../user/interface/user-interface-repository';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { UserInterfaceCreated } from '../../../user/interface/user-interface-created';

@Injectable()
export class UserTypeORMRepository implements UserInterfaceRepository {
  private readonly logger = new Logger(UserTypeORMRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersEntityRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<Record<string, any>> {
    const userEntity: UserEntity = plainToClass(UserEntity, createUserDTO);
    const userCreated = this.usersEntityRepository.create(userEntity);
    const userSaved = await this.usersEntityRepository.save(userCreated);
    this.logger.log('Criado registro.');
    return instanceToPlain<UserEntity>(userSaved);
  }

  async update(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<{ id: number; realized: boolean }> {
    const userEntity = plainToClass(UserEntity, updateUserDTO);
    const updated = await this.usersEntityRepository.update(id, userEntity);
    return { id, realized: updated.affected > 0 };
  }

  async delete(id: number): Promise<{ id: number; realized: boolean }> {
    const deleted = await this.usersEntityRepository.delete(id);
    return { id, realized: deleted.affected > 0 };
  }

  async findAll(): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersEntityRepository.find();
    const userPlain = instanceToPlain<UserEntity>(usersEntity);

    console.log(userPlain);

    return userPlain as UserInterfaceCreated[];
  }

  async findID(id: number): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersEntityRepository.find({
      where: {
        id,
      },
    });

    return instanceToPlain<UserEntity>(usersEntity) as UserInterfaceCreated[];
  }

  async existsID(id: number): Promise<boolean> {
    return this.usersEntityRepository.exist({
      where: {
        id,
      },
    });
  }

  async existsEMail(email: string): Promise<boolean> {
    return this.usersEntityRepository.exist({
      where: {
        email,
      },
    });
  }

  async existsEmailWithID(email: string, id: number): Promise<boolean> {
    return this.usersEntityRepository.exist({
      where: {
        id,
        email,
      },
    });
  }

  async findByEMail(email: string): Promise<UserInterfaceCreated[]> {
    const usersEntity = await this.usersEntityRepository.find({
      where: {
        email,
      },
    });

    return instanceToPlain<UserEntity>(usersEntity) as UserInterfaceCreated[];
  }
}
