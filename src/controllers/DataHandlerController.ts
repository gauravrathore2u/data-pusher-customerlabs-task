import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Account } from '../entities/Account';
import { Destination } from '../entities/Destination';
import axios from 'axios';

export class DataHandlerController {
    private accountRepository = AppDataSource.getRepository(Account);
    private destinationRepository = AppDataSource.getRepository(Destination);

    async handleIncomingData(req: Request, res: Response) {
        try {

            const secretToken = req.headers['cl-x-token'] as string;

            if (!secretToken) {
                return res.status(401).json({ error: 'Un Authenticate' });
            }

            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            const incomingData = req.body;
            if (!incomingData || typeof incomingData !== 'object') {
                return res.status(400).json({ error: 'Invalid Data' });
            }

            const account = await this.accountRepository.findOne({
                where: { appSecretToken: secretToken }
            });

            if (!account) {
                return res.status(401).json({ error: 'Un Authenticate' });
            }

            const destinations = await this.destinationRepository.find({
                where: { accountId: account.id }
            });

            if (destinations.length === 0) {
                return res.json({
                    message: 'Data received successfully, but no destinations configured',
                    accountId: account.accountId
                });
            }

            // Send data to all destinations
            const promises = destinations.map(async (destination) => {
                try {
                    await this.sendToDestination(destination, incomingData);
                    return {
                        destinationId: destination.id,
                        url: destination.url,
                        status: 'success'
                    };
                } catch (error) {
                    console.error(`Failed to send to destination ${destination.id}:`, error);
                    return {
                        destinationId: destination.id,
                        url: destination.url,
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    };
                }
            });

            const results = await Promise.allSettled(promises);
            const deliveryResults = results.map(result =>
                result.status === 'fulfilled' ? result.value : { status: 'failed' }
            );

            res.json({
                message: 'Data processed successfully',
                accountId: account.accountId,
                destinationsProcessed: destinations.length,
                deliveryResults
            });

        } catch (error) {
            console.error('Error handling incoming data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    private async sendToDestination(destination: Destination, data: any) {
        const { url, httpMethod, headers } = destination;

        const config: any = {
            method: httpMethod.toLowerCase(),
            url: url,
            headers: headers,
            timeout: 10000 // 10 seconds timeout
        };

        if (httpMethod.toUpperCase() === 'GET') {
            const queryParams = new URLSearchParams();

            const flattenData = (obj: any, prefix = '') => {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];
                        const newKey = prefix ? `${prefix}.${key}` : key;

                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            flattenData(value, newKey);
                        } else {
                            queryParams.append(newKey, String(value));
                        }
                    }
                }
            };

            flattenData(data);
            config.params = Object.fromEntries(queryParams.entries());
        } else {
            config.data = data;

            if (!headers['Content-Type'] && !headers['content-type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        const response = await axios(config);
        return response.data;
    }
}