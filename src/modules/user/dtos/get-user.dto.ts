import { IsNotEmpty, IsEmail } from 'class-validator';
import { Group } from 'src/modules/group';

export class GetUserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  groups: Group[];
}
