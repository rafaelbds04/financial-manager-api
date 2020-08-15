import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import Transaction from '../transactions/transaction.entity';

@Entity()
class Attachment {
    @PrimaryColumn()
    public id: number

    @Column()
    public url: string

    @Column()
    public key: string

    @ManyToOne(() => Transaction, (transaction: Transaction) => transaction.attachments)
    public transaction: string
}

export default Attachment;