import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transfer {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    fromAddress: string;

    @Column()
    toAddress: string;

    @Column()
    value: string;

    @Column()
    txid: string;

    @Column('boolean', {default: false})
    hasBlacklistAddress: boolean = false;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
