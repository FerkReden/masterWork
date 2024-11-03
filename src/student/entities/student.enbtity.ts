import { Group } from "src/group/entities/group.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string

    @Column({ unique: true })
    idNumber: string

    @Column({ default: false })
    isTaxpayer: boolean

    @ManyToOne(() => Group, (group) => group.students, { onDelete: 'SET NULL' })
    group: Group;
}