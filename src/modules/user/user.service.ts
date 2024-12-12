import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll() {
    try {
      const users = await this.userRepository.find();

      if (!users) {
        throw new NotFoundException('Users is missing');
      }
      return users;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async getById(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('Couldn`t find the user');
      }
      return user;
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async updateById(id: number, updateData: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('Couldn`t find the user');
      }

      const updatedUser = this.userRepository.merge(user, updateData);
      return await this.userRepository.save(updatedUser);
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }

  async deleteById(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Couldn`t find the user');
      }

      await this.userRepository.remove(user);
    } catch (e) {
      throw new BadRequestException('Iternal server error', e);
    }
  }
}
