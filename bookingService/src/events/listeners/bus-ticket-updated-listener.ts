import { Listener, Subjects, BusTicketUpdatedEvent } from "@selmathistckt/common";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";
import { queueGroupName } from "./queue-group-name";

export class BusTicketUpdatedListener extends Listener<BusTicketUpdatedEvent> {
  subject: Subjects.BusTicketUpdated = Subjects.BusTicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: BusTicketUpdatedEvent["data"], msg: Message) {
    const { id, userId, busId, seats, amount, version } = data;

    // Find the booking by ID and ensure the version matches for concurrency control
    const booking = await Booking.findOne({
      _id: id,
      version: version - 1, // Ensure we process the correct version in order
    });

    if (!booking) {
      throw new Error("Booking not found or version mismatch");
    }

    // Update booking fields
    booking.set({
      userId,
      busId,
      seats,
      amount,
    });

    await booking.save();

    console.log(`Booking updated: ${id}`);

    // Acknowledge the message
    msg.ack();
  }
}
