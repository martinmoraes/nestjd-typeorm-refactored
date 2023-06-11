import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { usersRepositoryMock } from '../testing-mock/users-repository.mock';
import { ShowMessageModule } from '../show-message/show-message.module';
import { ShowMessageService } from '../show-message/show-message.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

const userMockDTO: CreateUserDTO = {
  name: 'Martin',
  email: 'martin@coisa.qualquer.q',
  password: '123qweASD!@#',
  phone: '41 9921 4321',
};

describe('UserService', () => {
  let userService: UserService;
  let showMessage: ShowMessageService;
  let usersRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ShowMessageModule],
      providers: [UserService, usersRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    showMessage = module.get<ShowMessageService>(ShowMessageService);
    usersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('service defined', async () => {
    expect(await userService).toBeDefined();
    expect(await showMessage).toBeDefined();
  });

  it('show message', async () => {
    jest.spyOn(showMessage, 'showMessage').mockImplementation(() => 'is mock');

    const result = await userService.showMessage();

    expect(result).toEqual(
      expect.objectContaining({
        messageReceived: 'is mock e Port é 3000',
        time: expect.any(Number),
      }),
    );
  });

  describe('create user', () => {
    it('success create user', async () => {
      jest.spyOn(usersRepository, 'exist').mockResolvedValue(false);

      const userCreatedMock = plainToClass(UserEntity, {
        ...userMockDTO,
        id: 29,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(usersRepository, 'save').mockResolvedValue(userCreatedMock);

      const result = await userService.create(userMockDTO);

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Martin',
          email: 'martin@coisa.qualquer.q',
          phone: '41 9921 4321',
          id: 29,
        }),
      );
    });

    it('user already exists', async () => {
      jest.spyOn(usersRepository, 'exist').mockResolvedValue(true);

      await expect(userService.create(userMockDTO)).rejects.toThrowError(
        'E-Mail martin@coisa.qualquer.q, já cadastrado.',
      );
    });
  });

  describe('update user', () => {
    it('success update user', async () => {
      jest.spyOn(usersRepository, 'exist').mockResolvedValue(true);
      jest.spyOn(usersRepository, 'find').mockResolvedValue([]); //Email não encontrado
      jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      const result = await userService.update(11, userMockDTO);

      expect(result).toEqual(
        expect.objectContaining({ id: 11, realized: true }),
      );
    });

    it('user not found', async () => {
      jest.spyOn(usersRepository, 'exist').mockResolvedValue(false);

      await expect(userService.update(11, userMockDTO)).rejects.toThrowError(
        'Usuário 11 não encontrado.',
      );
    });
  });
});
