import express from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';

import { errorHandler, NotFoundError } from '@selmathistckt/common';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { oauthRouter } from './routes/oauth';  // Import OAuth routes
import './services/passport'; // Import Passport configuration

const app = express();

// Enable session handling using cookies
app.set('trust proxy', true);
app.use(json());


app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// app.use(
//   cookieSession({
//     signed: false, // Enable signing of cookies
//     keys: [process.env.COOKIE_SECRET_KEY || 'default_secret_key'], // Secret key to sign the cookies
//     secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
//     httpOnly: true, // Make cookies inaccessible to JavaScript
//     maxAge: 24 * 60 * 60 * 1000, // Set cookie expiry (1 day)
//   })
// );

// Initialize Passport.js and its session management
app.use(passport.initialize());
app.use(passport.session()); // Use session to store user

// Add your routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(oauthRouter);  // Use OAuth routes

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
