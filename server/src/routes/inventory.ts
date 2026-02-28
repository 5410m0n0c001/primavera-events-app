import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET Check Availability for a specific Date
router.get('/availability', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: 'Date is required' });

        const targetDate = new Date(date as string);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // 1. Find all CONFIRMED events for this date
        const conflictEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'CONFIRMED'
            },
            include: {
                quotes: {
                    where: { status: 'ACCEPTED' },
                    include: { items: true }
                }
            }
        });

        // 2. Calculate reserved quantities
        const reservedMap: Record<string, number> = {};
        conflictEvents.forEach((event: any) => {
            // Take the accepted quote (assuming 1 per event for now)
            const acceptedQuote = event.quotes[0];
            if (acceptedQuote) {
                acceptedQuote.items.forEach((qItem: any) => {
                    reservedMap[qItem.serviceItemId] = (reservedMap[qItem.serviceItemId] || 0) + qItem.quantity;
                });
            }
        });

        // 3. Fetch all catalog items with stock
        const allItems = await prisma.catalogItem.findMany({
            where: { stock: { gt: 0 } } // Only track items that are "inventory" (stock > 0)
        });

        // 4. Map availability
        const availability = allItems.map((item: any) => {
            const reserved = reservedMap[item.id] || 0;
            return {
                ...item,
                reserved,
                available: item.stock - reserved,
                status: (item.stock - reserved) <= 0 ? 'UNAVAILABLE' : 'AVAILABLE'
            };
        });

        res.json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error checking availability' });
    }
});

// POST Log Maintenance
router.post('/maintenance', async (req, res) => {
    try {
        const { itemId, type, quantity, cost, notes } = req.body;

        // 1. Create Log
        const log = await prisma.maintenanceLog.create({
            data: {
                itemId,
                type,
                quantity: parseInt(quantity),
                cost: parseFloat(cost),
                notes
            }
        });

        // 2. Update Stock logic
        // If "Loss" -> decrease stock. If "Replacement" -> increase stock.
        // If "Repair" -> maybe unavailable temporarily (not implemented yet, just logging)
        if (type === 'Loss') {
            await prisma.catalogItem.update({
                where: { id: itemId },
                data: { stock: { decrement: parseInt(quantity) } }
            });
        } else if (type === 'Replacement') {
            await prisma.catalogItem.update({
                where: { id: itemId },
                data: { stock: { increment: parseInt(quantity) } }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Error logging maintenance' });
    }
});

// GET Low Stock Alerts
router.get('/alerts', async (req, res) => {
    try {
        const threshold = 10; // Simple threshold
        const lowStockItems = await prisma.catalogItem.findMany({
            where: {
                stock: { lte: threshold, gt: 0 } // gt 0 to ignore services like "DJ" which might have 0 stock logic
            }
        });
        res.json(lowStockItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching alerts' });
    }
});

export default router;
