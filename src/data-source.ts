import { DataSource } from 'typeorm';
import { Account } from './entities/Account';
import { Destination } from './entities/Destination';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'data-pusher.db',
    synchronize: true,
    logging: false,
    entities: [Account, Destination],
    migrations: [],
    subscribers: [],
});