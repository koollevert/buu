import express from 'express';
import 'express-async-errors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from './middlewares/errorHandler';
import { deleteBookingRouter } from './routes/deleteBooking';
import { indexBookingRouter } from './routes/indexBooking';
import { showBookingRouter } from './routes/showBooking';
import { newBookingRouter } from './routes/newBookings';

const app = express();

// Trust the proxy (needed for cookie sessions when deploying to platforms like Heroku)
app.set('trust proxy', true);

// Middleware to parse JSON request bodies
app.use(json());

// Cookie session middleware (even though we won't use it for now, we can add it later if needed)
//{****}
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // only secure in production
  })
);

// Define the routes for the booking service
app.use(deleteBookingRouter);
app.use(indexBookingRouter);
app.use(showBookingRouter);
app.use(newBookingRouter);

// Catch-all handler for non-existing routes
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Error handler middleware
app.use(errorHandler);

export { app };
