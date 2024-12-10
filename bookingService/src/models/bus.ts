import mongoose, { Schema, Document } from 'mongoose';

interface BusDoc extends Document {
  busId: string;
  name: string;
  seats: boolean[]; // Available seats (true = booked, false = available)
}

const busSchema = new Schema(
  {
    busId: { type: String, required: true },
    name: { type: String, required: true },
    seats: { type: [Boolean], required: true },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model<BusDoc>('Bus', busSchema);
export { Bus };
