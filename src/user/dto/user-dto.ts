import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsString()
  phone: string;
}
