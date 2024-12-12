import { Subjects } from "./subjects";

export interface BookingCancelledEvent {
    subject: Subjects.BookingCancelled;
    data: {
        id: string;
        version: number; // For optimistic concurrency control
        busId: string;
        seats: number[]; // Seats being released due to cancellation
    };
}
