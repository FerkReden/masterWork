import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createGroupDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
