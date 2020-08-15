import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
    EXPENSE = 'expense',
    REVENUE = 'revenue'
}

@Entity()
class Category {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({ unique: true })
    public name: string

    @Column()
    public description?: string

    @Column({
        type: 'enum',
        enum: CategoryType,
        default: CategoryType.REVENUE
    })
    public categoryType: CategoryType

}

export default Category;