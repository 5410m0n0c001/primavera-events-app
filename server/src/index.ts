import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import clientRoutes from './routes/clients';
import calendarRoutes from './routes/calendar';
import catalogRoutes from './routes/catalog';
import staffRoutes from './routes/staff';
import inventoryRoutes from './routes/inventory';
import supplierRoutes from './routes/suppliers';
import financeRoutes from './routes/finance';
import cateringRoutes from './routes/catering';
import productionRoutes from './routes/production';
import analyticsRoutes from './routes/analytics';
import venuesRoutes from './routes/venues';
import { generateQuotePDF } from './services/pdfGenerator';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Primavera Events API' });
});

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/venues', venuesRoutes);

app.post('/api/quotes/generate-pdf', (req, res) => {
    const data = req.body;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion-${Date.now()}.pdf`);
    generateQuotePDF(data, res);
});

// Serve frontend static files
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
