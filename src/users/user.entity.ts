import { Entity, PrimaryGeneratedColumn, Column, Exclusion } from "typeorm";
import { Exclude } from 'class-transformer'

@Entity()
class User {
    @PrimaryGeneratedColumn()
    @Exclude()
    public id: number

    @Column()
    public name: string

    @Column({unique: true})
    public email: string

    @Column()
    @Exclude()
    public password: string
}

export default User;