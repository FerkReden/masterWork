import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { Group } from './entities';
import { createGroupDto } from './dtos';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGroup(@Body() createGroupDto: createGroupDto): Promise<Group> {
    return await this.createGroup(createGroupDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllGroups(): Promise<Group[]> {
    return await this.groupService.getAllGroups();
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async getByUserId(@Param('userId') userId: number): Promise<Group> {
    return await this.getByUserId(userId);
  }

  @Put(':groupId')
  @UseGuards(AuthGuard('jwt'))
  async updateById(
    @Param('groupId') groupId: number,
    @Body() updateData: Partial<Group>,
  ): Promise<Group> {
    return await this.groupService.updateById(groupId, updateData);
  }

  @Delete(':groupId')
  @UseGuards(AuthGuard('jwt'))
  async deleteById(@Param('groupId') groupId: number): Promise<void> {
    await this.deleteById(groupId);
  }
}
