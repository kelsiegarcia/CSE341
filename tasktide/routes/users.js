// routes/users.js
const express = require('express');
const router = express.Router();
const user = require('../models/user.js'); 

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
        const user = await user.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err });
    }
});

// POST new user
router.post('/', async (req, res) => {
    try {
        const { name, email, googleId } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        const user = new user({ name, email, googleId });
        const result = await user.save();
        res.status(201).json({ message: 'User created', user: result });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const result = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated', user: result });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const result = await user.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

module.exports = router;