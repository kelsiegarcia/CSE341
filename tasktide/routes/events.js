const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');



const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventsController');


// ------------------ VALIDATION RULES ------------------
const validateEvent = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 3 })
    .withMessage('Location must be at least 3 characters long'),
];

// ------------------ VALIDATION HANDLER ------------------
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ------------------ ROUTES ------------------


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
router.post('/', validateEvent, handleValidationErrors, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     description: Modify an existing event using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to update
 *         schema:
 *           type: string
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
 *                 example: Updated Community Cleanup
 *               description:
 *                 type: string
 *                 example: Updated description for this event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-05T09:00:00.000Z
 *               location:
 *                 type: string
 *                 example: Ala Moana Beach Park
 *     responses:
 *       204:
 *         description: Event updated successfully (no content returned)
 *       400:
 *         description: Invalid input or validation error
 *       404:
 *         description: Event not found
 */
// PUT
router.put('/:id', validateEvent, handleValidationErrors, updateEvent);

// DELETE
router.delete('/:id', deleteEvent);


module.exports = router;