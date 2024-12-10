import express from 'express';
import 'express-async-errors'; // Import this for async error handling

import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@selmathistckt/common'; // Assuming you have a shared error handler
import { newBookingRouter } from '.newBookings/routes/newBooking'; // Importing the new booking route
import { deleteBookingRouter } from './routes/deleteBooking'; // Importing the delete booking route

const app = express();

app.set('trust proxy', true); // For production environments with reverse proxies
app.use(json()); // Middleware to parse incoming JSON requests

// Use the booking and delete booking routers
app.use(newBookingRouter);
app.use(deleteBookingRouter);

// Handle 404 errors for undefined routes
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Global error handler
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export { app };
