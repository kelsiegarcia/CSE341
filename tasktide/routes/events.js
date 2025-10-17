// Event routes

const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { getAllEvents, createEvent, getEventById } = require('../controllers/eventsController');


/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Adds a new event to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createEvent);

// Create a new event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;