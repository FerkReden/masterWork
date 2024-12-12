import { Student } from 'src/modules/student';
import { User } from 'src/modules/user';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column()
  groupName: string;

  @Column()
  userId: number;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];

  @ManyToOne(() => User, (user) => user.groups)
  @JoinTable()
  @JoinColumn({ name: 'userId' })
  user: User;
}
