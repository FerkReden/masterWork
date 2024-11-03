import { Student } from "src/student/entities/student.enbtity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    GroupId: number;

    @Column()
    groupName: string;

    @OneToMany(() => Student, (student) => student.group)
    students: Student[];
}