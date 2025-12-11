import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all events (for calendar view)
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                client: true // Include client name for the calendar event
            }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// POST create event
router.post('/', async (req, res) => {
    try {
        const { name, type, date, guestCount, clientId, status } = req.body;
        const event = await prisma.event.create({
            data: {
                name,
                type,
                date: new Date(date),
                guestCount: parseInt(guestCount),
                clientId,
                status: status || 'DRAFT'
            }
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
});

export default router;
