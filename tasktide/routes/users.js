// routes/users.js
const express = require('express');
const router = express.Router();
const user = require('../models/user.js'); 
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../middleware/authMiddleware.js');


// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err });
    }
});

// GET one user by ID
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await user.findById(req.params.id);
        if (!foundUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err });
    }
});

// POST new user
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const { name, email, googleId } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (googleId && typeof googleId !== 'string') {
            return res.status(400).json({ message: 'googleId must be a string' });
        }
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required' });
            }

        const newUser = new user({ name, email, googleId });
        const result = await newUser.save();

        res.status(201).json({ message: 'User created', user: result });
    } catch (err) {
        console.error('❌ Error creating user:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message || err
        });
    }
});
// PUT update user
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const allowedFields = ['name', 'email', 'googleId'];
        const updates = Object.keys(req.body);

        // No body sent
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Block unexpected fields
        const isValidUpdate = updates.every(field => allowedFields.includes(field));
        if (!isValidUpdate) {
            return res.status(400).json({ message: 'Invalid fields in update request' });
        }

        const result = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated', user: result });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});

// DELETE user
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const result = await user.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

module.exports = router;