import { CreateUserDTO } from '../dto/create-user-dto';
import { UpdateUserDTO } from '../dto/update-user-dto';

export interface UserInterfaceRepository {
  create(userDTO: CreateUserDTO): Promise<Record<string, any>>;

  update(
    id: number,
    userDTO: UpdateUserDTO,
  ): Promise<{ id: number; realized: boolean }>;

  delete(id: number): Promise<{ id: number; realized: boolean }>;

  findAll(): Promise<Record<string, any>[]>;

  findID(id: number): Promise<Record<string, any>[]>;

  existsID(id: number): Promise<boolean>;

  existsEMail(email: string): Promise<boolean>;

  existsEmailWithID(email: string, id: number): Promise<boolean>;
}
