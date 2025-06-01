import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import accountRoutes from './routes/accountRoutes';
import destinationRoutes from './routes/destinationRoutes';
import dataHandlerRoutes from './routes/dataHandlerRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/accounts', accountRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/server', dataHandlerRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`Data endpoint: http://localhost:${PORT}/server/incoming_data`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

export default app;