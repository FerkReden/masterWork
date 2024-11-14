import { Injectable, NotFoundException } from '@nestjs/common';
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
    const users = await this.userRepository.find();

    if (!users) {
      throw new NotFoundException('Users is missing');
    }
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Couldn`t find the user');
    }
    return user;
  }

  async updateUserById(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Couldn`t find the user');
    }

    const updatedUser = this.userRepository.merge(user, updateData);
    return await this.userRepository.save(updatedUser);
  }

  async deleteById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Couldn`t find the user');
    }

    await this.userRepository.remove(user);
    return user;
  }
}
