import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user';

// Google OAuth strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "/api/users/auth/google/callback", // URL for callback after Google OAuth
//     },
//     async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
//       // Find or create a user in the database
//       let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

//       if (!user) {
//         user = new User({
//           email: profile.emails?.[0]?.value,
//           oauthId: profile.id,
//           oauthProvider: 'google',
//         });
//         await user.save();
//       }

//       done(null, user);
//     }
//   )
// );

// GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "/api/users/auth/github/callback", // URL for callback after GitHub OAuth
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
      // Find or create a user in the database
      let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'github' });

      if (!user) {
        user = new User({
          email: profile.emails?.[0]?.value,
          oauthId: profile.id,
          oauthProvider: 'github',
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