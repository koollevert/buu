import { Subjects, Publisher, BookingCancelledEvent } from "@selmathistckt/common";
export class BookingCancelledPublisher extends Publisher<BookingCancelledEvent> {
    subject: Subjects.BookingCancelled = Subjects.BookingCancelled;
}
