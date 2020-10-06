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
}

export default Attachment;