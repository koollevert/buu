import { Subjects } from "./subjects";

export interface BookingCompletedEvent {
    subject: Subjects.BookingCompleted; // Add this to your `Subjects` enum
    data: {
        id: string; // Booking ID
        userId: string; // ID of the user who completed the booking
        busId: string; // Bus ID associated with the booking
        seats: number[]; // Seats booked
        amount: number; // Total cost
        version: number; // Version for concurrency control
    };
}
