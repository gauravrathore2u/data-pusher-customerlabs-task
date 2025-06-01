import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Destination {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: string;

    @Column()
    httpMethod!: string;

    @Column('json')
    headers!: Record<string, string>;

    @ManyToOne(() => Account, account => account.destinations, {
        onDelete: 'CASCADE'
    })
    account!: Account;

    @Column()
    accountId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}