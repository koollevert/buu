import mongoose, { Schema, Document } from 'mongoose';

// Extend the Booking interface
interface BookingDoc extends Document {
  userId: string;
  busId: string;
  seats: number[];
  amount: number;
  expiresAt: Date;
  version: number; // Add the version field explicitly
}

// Define the Booking schema
const bookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    busId: { type: String, required: true },
    seats: { type: [Number], required: true },
    amount: { type: Number, required: true },
    expiresAt: { type: Date, required: true }, // Add the expiresAt field
  },
  {
    timestamps: true,
    versionKey: 'version', // Map Mongoose's version key to "version"
  }
);

// Create the Booking model
const Booking = mongoose.model<BookingDoc>('Booking', bookingSchema);
export { Booking };
