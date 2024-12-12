import { Injectable } from '@nestjs/common';
import { Student } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private userRepository: Repository<Student>,
  ) {}
  
}
