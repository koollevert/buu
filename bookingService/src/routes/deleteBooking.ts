import express, { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { NotFoundError, NotAuthorizedError } from '@selmathistckt/common';  // Assume these errors are defined
import { BookingCancelledPublisher } from '../events/publishers/booking-cancelled-publisher'; // Assuming a similar publisher exists
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/bookings/:bookingId', async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundError();  // Throw error if booking not found
    }

    // Optionally, check for authorization (e.g., user owning the booking)
    if (booking.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();  // Throw error if the user is not authorized
    }

    // Cancel the booking (soft delete or status change)
    booking.status = 'Cancelled';  // You can also set this to an enum like 'Cancelled'
    await booking.save();

    // Publish the booking cancellation event (optional, if your business logic needs it)
    new BookingCancelledPublisher(natsWrapper.client).publish({
      id: booking.id,
      version: booking.version,
      userId: booking.userId,
      busId: booking.busId,
      seats: booking.seats,
      amount: booking.amount,
    });

    res.status(204).send(booking);  // Respond with no content (204) after successful deletion/cancellation
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as deleteBookingRouter };
