import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";
import User from '../users/user.entity';
import Category from '../categories/category.entity';
import Attachment from '../attachments/attachment.entity';

export enum TransactionType {
    EXPENSE = 'expense',
    REVENUE = 'revenue'
}

@Entity()
class Transaction {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public name: string

    @ManyToOne(() => User, (author: User) => author.id)
    @JoinColumn()
    public author: User

    @Column({
        default: 'Does not have description'
    })
    public description?: string

    @Column({
        type: 'enum',
        enum: TransactionType,
        default: TransactionType.EXPENSE
    })
    public transactionType: TransactionType

    @Column({
        type: 'decimal'
    })
    public amount: number

    @Column({ type: 'timestamp' })
    public transactionDate: Date

    @Column({ type: 'timestamp', nullable: true })
    public dueDate?: Date

    @Column({ type: 'timestamp', nullable: true })
    public paidDate?: Date

    @Column({ type: 'boolean' })
    public paid: boolean

    @Column({ nullable: true, unique: true })
    public receiptKey?: string

    @ManyToOne(() => Category, (category: Category) => category.id)
    @JoinColumn()
    public category: Category

    @OneToMany(() => Attachment, (attachment: Attachment) => attachment.transaction)
    public attachments?: Attachment[]

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date
}

export default Transaction;