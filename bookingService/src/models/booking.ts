import mongoose, { Schema, Document } from 'mongoose';

interface BookingDoc extends Document {
  userId: string;
  busId: string;
  seats: number[];
  amount: number;
}

const bookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    busId: { type: String, required: true },
    seats: { type: [Number], required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<BookingDoc>('Booking', bookingSchema);
export { Booking };
