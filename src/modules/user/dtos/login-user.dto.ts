import { IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password must contain more than 6 symbols' })
  @Matches(/(?=.*[a-z])/, {
    message: 'password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'password must contain at least one special character',
  })
  password: string;
}
