import {
    Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import Transaction from '../transactions/transaction.entity';

@Entity()
class Attachment {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({
        nullable: true
    })
    public url?: string

    @Column()
    public key: string

    @ManyToOne(() => Transaction, (transaction: Transaction) => transaction.id, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    public transaction?: Transaction

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date
}

export default Attachment;