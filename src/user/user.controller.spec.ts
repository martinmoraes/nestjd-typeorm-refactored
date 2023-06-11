import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeORMConfigModule } from '../adapters-OLD/repository/typeorm/typeorm-config.model';
import { ShowMessageModule } from '../show-message/show-message.module';
import { UserTypeORMRepository } from '../adapters-OLD/repository/typeorm/user-typeorm.repository';
import {
  arrayOfUsers,
  usersRepositoryImplementedMock,
  userCreateDTO,
} from '../testing-mock/users-repository.mock';
import { ShowMessageService } from '../show-message/show-message.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let showMessage: ShowMessageService;
  let usersRepository: UserTypeORMRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeORMConfigModule, ShowMessageModule],
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserTypeORMRepository)
      .useValue(usersRepositoryImplementedMock)
      .compile();

    userController = app.get<UserController>(UserController);
    showMessage = app.get<ShowMessageService>(ShowMessageService);
    usersRepository = app.get<UserTypeORMRepository>(UserTypeORMRepository);
  });

  it('should return Message', async () => {
    jest.spyOn(showMessage, 'showMessage').mockImplementation(() => 'is mock');

    const receivd = await userController.getMessage();

    expect(receivd).toEqual({
      messageReceived: 'is mock',
      time: expect.any(Number),
    });
  });

  describe('Post - create user', () => {
    it('success create user', async () => {
      jest.spyOn(usersRepository, 'existsEMail').mockResolvedValue(false);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(arrayOfUsers[0]);

      const result = await userController.create(userCreateDTO);

      console.log(result);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
        }),
      );
    });

    it('create user with email already exists', async () => {
      const mock = jest
        .spyOn(usersRepository, 'existsEMail')
        .mockResolvedValue(true);

      await expect(userController.create(userCreateDTO)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  it('Get - list users', async () => {
    jest.spyOn(usersRepository, 'findAll').mockResolvedValue(arrayOfUsers);

    const result = await userController.list();

    expect(result).toEqual(arrayOfUsers);
  });

  describe('Get - show a user', () => {
    it('success show a user', async () => {
      jest.spyOn(usersRepository, 'findID').mockResolvedValue(arrayOfUsers);

      const result = await userController.show(1);

      expect(result).toEqual(arrayOfUsers);
    });

    it('show user not found', async () => {
      jest.spyOn(usersRepository, 'findID').mockResolvedValue([]);

      await expect(userController.show(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('Put - alter user', () => {
    it('success alter user', async () => {
      jest.spyOn(usersRepository, 'existsID').mockResolvedValue(true);
      jest
        .spyOn(usersRepository, 'findByEMail')
        .mockResolvedValue(arrayOfUsers);
      jest.spyOn(usersRepository, 'update').mockResolvedValue({
        id: 1,
        realized: true,
      });

      const result = await userController.update(
        arrayOfUsers[0].id,
        userCreateDTO,
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          realized: expect.any(Boolean),
        }),
      );
    });

    it('alter user not found', async () => {
      const mockExistsID = jest
        .spyOn(usersRepository, 'existsID')
        .mockResolvedValue(false);

      expect(
        userController.update(arrayOfUsers[0].id, userCreateDTO),
      ).rejects.toThrowError(NotFoundException);

      mockExistsID.mockClear();
    });

    it('email in use', async () => {
      jest.spyOn(usersRepository, 'existsID').mockResolvedValue(true);
      jest
        .spyOn(usersRepository, 'findByEMail')
        .mockResolvedValue(arrayOfUsers);

      expect(userController.update(1, userCreateDTO)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
