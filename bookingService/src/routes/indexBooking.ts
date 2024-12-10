import express, { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { NotFoundError } from '@selmathistckt/common'; // Optional for when no bookings exist

const router = express.Router();

router.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    // Fetch all bookings from the database
    const bookings = await Booking.find();

    // If no bookings are found, throw a NotFoundError (optional)
    if (bookings.length === 0) {
      throw new NotFoundError();  // This can be customized to send a different response if needed
    }

    // Send the bookings as the response
    res.status(200).send(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as indexBookingRouter };
