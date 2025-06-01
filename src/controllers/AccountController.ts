import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Account } from '../entities/Account';

export class AccountController {
    private accountRepository = AppDataSource.getRepository(Account);

    // Create Account
    async create(req: Request, res: Response) {
        try {
            const { email, accountName, website } = req.body;

            if (!email || !accountName) {
                return res.status(400).json({
                    error: 'Email and account name are required fields'
                });
            }

            const existingAccount = await this.accountRepository.findOne({
                where: { email }
            });

            if (existingAccount) {
                return res.status(409).json({
                    error: 'Account with this email already exists'
                });
            }

            const account = new Account();
            account.email = email;
            account.accountName = accountName;
            account.website = website;

            const savedAccount = await this.accountRepository.save(account);

            res.status(201).json({
                id: savedAccount.id,
                accountId: savedAccount.accountId,
                email: savedAccount.email,
                accountName: savedAccount.accountName,
                appSecretToken: savedAccount.appSecretToken,
                website: savedAccount.website,
                createdAt: savedAccount.createdAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get All Accounts
    async getAll(req: Request, res: Response) {
        try {
            const accounts = await this.accountRepository.find({
                relations: ['destinations']
            });

            res.json(accounts.map(account => ({
                id: account.id,
                accountId: account.accountId,
                email: account.email,
                accountName: account.accountName,
                website: account.website,
                destinationsCount: account.destinations.length,
                createdAt: account.createdAt
            })));
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get Account by ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await this.accountRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['destinations']
            });

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json({
                id: account.id,
                accountId: account.accountId,
                email: account.email,
                accountName: account.accountName,
                appSecretToken: account.appSecretToken,
                website: account.website,
                destinations: account.destinations,
                createdAt: account.createdAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update Account
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, accountName, website } = req.body;

            const account = await this.accountRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            if (email && email !== account.email) {
                const existingAccount = await this.accountRepository.findOne({
                    where: { email }
                });
                if (existingAccount) {
                    return res.status(409).json({
                        error: 'Account with this email already exists'
                    });
                }
                account.email = email;
            }

            if (accountName) account.accountName = accountName;
            if (website !== undefined) account.website = website;

            const updatedAccount = await this.accountRepository.save(account);

            res.json({
                id: updatedAccount.id,
                accountId: updatedAccount.accountId,
                email: updatedAccount.email,
                accountName: updatedAccount.accountName,
                website: updatedAccount.website,
                updatedAt: updatedAccount.updatedAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete Account
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const account = await this.accountRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            await this.accountRepository.remove(account);
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}