import { Listener, Subjects, BusTicketCreatedEvent } from "@selmathistckt/common";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";
import { queueGroupName } from "./queue-group-name";

export class BusTicketCreatedListener extends Listener<BusTicketCreatedEvent> {
  subject: Subjects.BusTicketCreated = Subjects.BusTicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: BusTicketCreatedEvent["data"], msg: Message) {
    const { id, userId, busId, seats, amount } = data;

    // Save the booking info to the database
    const booking = Booking.build({
      id,
      userId,
      busId,
      seats,
      amount,
    });

    await booking.save();

    console.log(`Bus ticket booking created: ${id}`);

    // Acknowledge the message
    msg.ack();
  }
}
