import express, { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { NotFoundError } from '@selmathistckt/common'; // For consistent error handling

const router = express.Router();

router.get('/api/bookings/:id', async (req: Request, res: Response) => {
  try {
    // Find the booking by its ID
    const booking = await Booking.findById(req.params.id);

    // If no booking is found, throw a NotFoundError
    if (!booking) {
      throw new NotFoundError();
    }

    // Send the booking details as the response
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as showBookingRouter };
