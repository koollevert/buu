import { Subjects, Publisher, BookingCreatedEvent } from "@selmathistckt/common";
export class BookingCreatedPublisher extends Publisher<BookingCreatedEvent> {
    subject: Subjects.BookingCreated = Subjects.BookingCreated;
}