import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Bus } from '../models/bus';
import { Booking } from '../models/booking';
import { validateRequest, NotFoundError, BadRequestError } from '@selmathistckt/common';
import { BookingCreatedPublisher } from '../events/publishers/booking-created-publisher'; // Assuming you have this publisher
import { natsWrapper } from '../nats-wrapper';
import { body } from 'express-validator';


const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // Adjust the expiration time as per your requirements

router.post(
  '/api/bookings',
  [
    body('userId')
      .not()
      .isEmpty()
      .withMessage('UserId must be provided'), //something went
    body('busId')
      .not()
      .isEmpty()
      .custom((input: any) => mongoose.Types.ObjectId.isValid(input as string))
      .withMessage('BusId must be provided and be a valid ObjectId'),
    body('seats')
      .isArray({ min: 1 })
      .withMessage('Seats must be an array and contain at least one seat')
      .custom((seats: any[]) => seats.every((seat) => typeof seat === 'number'))
      .withMessage('Each seat should be a number'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId, busId, seats, amount } = req.body;

    try {
      // Find the bus by ID
      const bus = await Bus.findById(busId);
      if (!bus) {
        throw new NotFoundError();
      }

      // Check seat availability
      const unavailableSeats = seats.filter((seat: string | number) => bus.seats[seat as any]);
      if (unavailableSeats.length) {
        throw new BadRequestError(`Seats ${unavailableSeats.join(', ')} are already booked`);
      }

      // Mark the seats as booked
      seats.forEach((seat: string | number) => (bus.seats[seat as any] = true));
      await bus.save();

      // Calculate expiration (if applicable to booking logic)
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

      // Create the booking
      const booking = new Booking({
        userId,
        busId,
        seats,
        amount,
        expiresAt: expiration,
      });
      await booking.save();

      // Publish the booking event (replace with your specific event type)
      new BookingCreatedPublisher(natsWrapper.client).publish({
        id: booking.id,
        version: booking.version,
        userId: booking.userId,
        busId: booking.busId,
        seats: booking.seats,
        amount: booking.amount,
        expiresAt: booking.expiresAt.toISOString(),
      });

      res.status(201).send(booking);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
);

export { router as newBookingRouter };
