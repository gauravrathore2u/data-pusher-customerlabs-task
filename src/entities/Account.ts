import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Destination } from './Destination';


@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    accountId!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    accountName!: string;

    @Column()
    appSecretToken!: string;

    @Column({ nullable: true })
    website?: string;

    @OneToMany(() => Destination, destination => destination.account, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    destinations!: Destination[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    generateIds() {
        this.accountId = uuidv4();
        this.appSecretToken = uuidv4().replace(/-/g, '') + Date.now().toString();
    }
}