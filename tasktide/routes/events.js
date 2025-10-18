const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventsController');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events.
 *     responses:
 *       200:
 *         description: A list of events
 */
router.get('/', getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Add a new event to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Community Beach Cleanup
 *               description:
 *                 type: string
 *                 example: Join us for a Saturday morning cleanup at the park!
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-05T09:00:00.000Z
 *               location:
 *                 type: string
 *                 example: Ala Moana Beach Park
 *     responses:
 *       201:
 *         description: Event created
 *       400:
 *         description: Invalid input or missing required fields
 */

// Create a new event
router.post('/', createEvent);

// PUT
router.put('/:id', updateEvent);
// DELETE
router.delete('/:id', deleteEvent);


module.exports = router;