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
//       callbackURL: "/api/auth/google/callback", // Updated path
//     },
//     async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
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
      callbackURL: "/api/auth/github/callback", // Updated path
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
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
