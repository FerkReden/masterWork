import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dtos/get-user.dto';
import { User } from './entities';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<GetUserDto[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<GetUserDto> {
    return await this.userService.getById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateById(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return await this.userService.updateById(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteById(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteById(id);
  }
}
