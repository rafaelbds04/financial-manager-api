import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date
}

export default Attachment;