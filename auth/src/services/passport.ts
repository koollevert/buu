import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user';
import { Express } from 'express';

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/users/auth/google/callback", // URL for callback after Google OAuth
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find or create a user in the database
      let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

      if (!user) {
        user = new User({
          email: profile.emails?.[0]?.value,
          oauthId: profile.id,
          oauthProvider: 'google',
        });
        await user.save();
      }

      done(null, user);
    }
  )
);

// Passport session handling (serialize/deserialize)
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id); // Retrieve user by ID from DB
    done(null, user);
  } catch (err) {
    done(err);
  }
});
