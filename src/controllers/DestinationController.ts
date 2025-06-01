import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Destination } from '../entities/Destination';
import { Account } from '../entities/Account';

export class DestinationController {
    private destinationRepository = AppDataSource.getRepository(Destination);
    private accountRepository = AppDataSource.getRepository(Account);

    // Create Destination
    async create(req: Request, res: Response) {
        try {
            const { url, httpMethod, headers, accountId } = req.body;

            if (!url || !httpMethod || !headers || !accountId) {
                return res.status(400).json({
                    error: 'URL, HTTP method, headers, and account ID are required'
                });
            }

            const account = await this.accountRepository.findOne({
                where: { id: accountId }
            });

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            const destination = new Destination();
            destination.url = url;
            destination.httpMethod = httpMethod.toUpperCase();
            destination.headers = headers;
            destination.account = account;
            destination.accountId = accountId;

            const savedDestination = await this.destinationRepository.save(destination);

            res.status(201).json({
                id: savedDestination.id,
                url: savedDestination.url,
                httpMethod: savedDestination.httpMethod,
                headers: savedDestination.headers,
                accountId: savedDestination.accountId,
                createdAt: savedDestination.createdAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get All Destinations
    async getAll(req: Request, res: Response) {
        try {
            const destinations = await this.destinationRepository.find({
                relations: ['account']
            });

            res.json(destinations.map(dest => ({
                id: dest.id,
                url: dest.url,
                httpMethod: dest.httpMethod,
                headers: dest.headers,
                accountId: dest.accountId,
                accountName: dest.account.accountName,
                createdAt: dest.createdAt
            })));
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get Destination by ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const destination = await this.destinationRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['account']
            });

            if (!destination) {
                return res.status(404).json({ error: 'Destination not found' });
            }

            res.json({
                id: destination.id,
                url: destination.url,
                httpMethod: destination.httpMethod,
                headers: destination.headers,
                accountId: destination.accountId,
                accountName: destination.account.accountName,
                createdAt: destination.createdAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get Destinations by Account ID
    async getByAccountId(req: Request, res: Response) {
        try {
            const { accountId } = req.params;

            const account = await this.accountRepository.findOne({
                where: { id: parseInt(accountId) }
            });

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            const destinations = await this.destinationRepository.find({
                where: { accountId: parseInt(accountId) }
            });

            res.json({
                accountId: parseInt(accountId),
                accountName: account.accountName,
                destinations: destinations.map(dest => ({
                    id: dest.id,
                    url: dest.url,
                    httpMethod: dest.httpMethod,
                    headers: dest.headers,
                    createdAt: dest.createdAt
                }))
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update Destination
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { url, httpMethod, headers } = req.body;

            const destination = await this.destinationRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!destination) {
                return res.status(404).json({ error: 'Destination not found' });
            }

            if (url) destination.url = url;
            if (httpMethod) destination.httpMethod = httpMethod.toUpperCase();
            if (headers) destination.headers = headers;

            const updatedDestination = await this.destinationRepository.save(destination);

            res.json({
                id: updatedDestination.id,
                url: updatedDestination.url,
                httpMethod: updatedDestination.httpMethod,
                headers: updatedDestination.headers,
                updatedAt: updatedDestination.updatedAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete Destination
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const destination = await this.destinationRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!destination) {
                return res.status(404).json({ error: 'Destination not found' });
            }

            await this.destinationRepository.remove(destination);
            res.json({ message: 'Destination deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}