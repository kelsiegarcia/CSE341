const express = require('express');
const passport = require('passport');

const router = express.Router();

// ------------------ GOOGLE AUTH ------------------
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect to the welcome page after successful login
        res.redirect('/api-docs');
    }
);

// ------------------ WELCOME PAGE ------------------
router.get('/welcome', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/google');
    }

    res.send(`
    <h1>Welcome to TaskTide!</h1>
    <p>You're logged in as <strong>${req.user.displayName}</strong></p>
    <a href="/auth/logout">Logout</a>
  `);
});

// ------------------ LOGOUT ------------------
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;