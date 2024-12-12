import { Listener, Subjects, BusUpdatedEvent } from "@selmathistckt/common";
import { Message } from "node-nats-streaming";
import { Bus } from "../../models/bus";
import { queueGroupName } from "./queue-group-name";

export class BusUpdatedListener extends Listener<BusUpdatedEvent> {
  subject: Subjects.BusUpdated = Subjects.BusUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: BusUpdatedEvent["data"], msg: Message) {
    const { busId, name, seats } = data;

    // Find the bus by busId
    const bus = await Bus.findOne({ busId });

    if (!bus) {
      throw new Error("Bus not found");
    }

    // Update the bus fields
    bus.set({ name, seats });
    await bus.save();

    console.log(`Bus updated: ${busId}`);

    // Acknowledge the message
    msg.ack();
  }
}
