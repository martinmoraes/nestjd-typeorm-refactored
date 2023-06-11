import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserDTO } from '../user/dto/user-dto';
import { Repository } from 'typeorm';

export const userCreateDTO: UserDTO = {
  name: 'Camila Morães',
  email: 'camila@gmail.com',
  phone: '41 1234 5665',
  password: '1qaz2wsx',
};

export const arrayOfUsers = [
  {
    id: 8,
    name: 'Camila Morães',
    email: 'camila@gmail.com',
    phone: '41 1234 5665',
  },
];

export const usersRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  // useClass: Repository,
  useValue: {
    existsEMail: jest.fn(),
    create: jest.fn(),
    existsID: jest.fn(),
    existsEmailWithID: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findID: jest.fn(),
    findByEMail: jest.fn(),
    delete: jest.fn(),
    exist: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  },
};

export const usersRepositoryImplementedMock = {
  existsEMail: jest.fn(),
  create: jest.fn(),
  existsID: jest.fn(),
  existsEmailWithID: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findID: jest.fn(),
  findByEMail: jest.fn(),
  delete: jest.fn(),
};
