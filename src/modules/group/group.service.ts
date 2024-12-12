import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities';
import { Repository } from 'typeorm';
import { createGroupDto } from './dtos/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async createGroup(createGroupDto: createGroupDto): Promise<Group> {
    try {
      const { groupName, userId } = createGroupDto;

      const group = await this.groupRepository.create({
        groupName,
        userId,
      });

      return group;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async getAllGroups(): Promise<Group[]> {
    try {
      const groups = await this.groupRepository.find();

      if (!groups) {
        throw new NotFoundException('Groups is missing');
      }
      return groups;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async getByUserId(userId: number): Promise<Group[]> {
    try {
      const groups = await this.groupRepository.find({
        where: { userId: userId },
      });

      if (!groups) {
        throw new NotFoundException('Groups with this user is missing');
      }
      return groups;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async getById(groupId: number): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where: { groupId },
      });

      if (!group) {
        throw new NotFoundException('Group is missing');
      }
      return group;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async updateById(
    groupId: number,
    updateData: Partial<Group>,
  ): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where: {
          groupId,
        },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const updatedGroup = this.groupRepository.merge(group, updateData);
      return await this.groupRepository.save(updatedGroup);
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async deleteById(groupId: number): Promise<void> {
    try {
      const group = await this.groupRepository.findOne({
        where: {
          groupId,
        },
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      await this.groupRepository.remove(group);
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }
}
