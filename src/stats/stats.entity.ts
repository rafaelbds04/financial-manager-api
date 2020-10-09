import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
class Stats {
    @Exclude()
    @PrimaryColumn()
    public id?: number

    @Column({ type: 'decimal' })
    public revenue?: number

    @Column({ type: 'decimal' })
    public expense?: number

    @Column({ type: 'decimal' })
    public due?: number

    @Column({ type: 'decimal' })
    public overDue?: number

}

export default Stats;