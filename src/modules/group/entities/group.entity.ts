import { Student } from 'src/modules/student';
import { User } from 'src/modules/user';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  GroupId: number;

  @Column()
  groupName: string;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];
}
