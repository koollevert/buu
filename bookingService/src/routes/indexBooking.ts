import express, { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { NotFoundError } from '@selmathistckt/common';

const router = express.Router();

router.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();

    if (bookings.length === 0) {
      throw new NotFoundError();
    }

    res.status(200).send(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as indexBookingRouter };
