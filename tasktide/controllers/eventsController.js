// controllers/eventsController.js
const { default: mongoose } = require('mongoose');
const Event = require('../models/event');



// Get all events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        next(error);    
    }
};

// Get event by ID
const getEventById = async (req, res, next) => {   // ✅ must include next
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event by ID:', error.message);
        next(error);  // ✅ calls Express error middleware
    }
};

// Create a new event
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
      next(error);  
    }
};

// PUT
const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        next(error);    
    }
}

// DELETE
const deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);    
    }
}


module.exports = { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent  };