import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Google OAuth route
router.get('/api/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google OAuth callback route
router.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin',
}), (req, res) => {
    res.redirect('/'); // Redirect to homepage or user profile page
});

// GitHub OAuth route
router.get('/api/auth/github', passport.authenticate('github', {
    scope: ['user:email'],
}));

// GitHub OAuth callback route
router.get('/api/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin',
}), (req, res) => {
    res.redirect('/'); // Redirect to homepage or user profile page
});

export { router as oauthRouter };
