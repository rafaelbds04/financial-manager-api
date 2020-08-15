import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import User from '../users/user.entity';
import Category from '../categories/category.entity';
import Attachment from '../attachments/attachment.entity';

enum TransactionType {
    EXPENSE = 'expense',
    REVENUE = 'revenue'
}

@Entity()
class Transaction {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public name: string

    @OneToOne(() => User)
    @JoinColumn()
    public author: User

    @Column()
    public description?: string

    @Column({
        type: 'enum',
        enum: TransactionType,
        default: TransactionType.EXPENSE
    })
    public transactionType: TransactionType

    @Column()
    public amount: number

    @Column({ type: 'date' })
    public transactionDate: string

    @Column({ type: 'date' })
    public dueDate: string

    @Column({ type: 'boolean' })
    public paid: boolean

    @OneToOne(() => Category)
    @JoinColumn()
    public category: Category

    @OneToMany(() => Attachment, (attachment: Attachment) => attachment.transaction)
    public attachments?: Attachment[]
}

export default Transaction;