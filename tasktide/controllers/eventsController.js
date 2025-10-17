// controllers/eventsController.js
const Event = require('../models/Event');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
    }
};

// POST /events
exports.createEventHandler = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllEvents: exports.getAllEvents,
    createEvent: exports.createEvent,
    createEventHandler: exports.createEventHandler
};