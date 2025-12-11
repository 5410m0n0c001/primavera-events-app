import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all venues
router.get('/', async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(venues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
});

// GET single venue
router.get('/:id', async (req, res) => {
    try {
        const venue = await prisma.venue.findUnique({
            where: { id: req.params.id },
            include: {
                events: {
                    select: {
                        id: true,
                        date: true,
                        type: true,
                        status: true
                    }
                }
            }
        });
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        res.json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
});

// CREATE venue
router.post('/', async (req, res) => {
    try {
        const venue = await prisma.venue.create({
            data: req.body
        });
        res.json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create venue' });
    }
});

// UPDATE venue
router.put('/:id', async (req, res) => {
    try {
        const venue = await prisma.venue.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update venue' });
    }
});

// DELETE venue
router.delete('/:id', async (req, res) => {
    try {
        await prisma.venue.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete venue' });
    }
});

// GET venue availability calendar (events for a specific venue)
router.get('/:id/calendar', async (req, res) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0);

        const events = await prisma.event.findMany({
            where: {
                venueId: req.params.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch calendar' });
    }
});

export default router;
