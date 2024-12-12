import { Subjects } from "./subjects";

export interface BookingFailedEvent {
    subject: Subjects.BookingFailed; // Add this to your `Subjects` enum
    data: {
        id: string; // Booking ID
        userId: string; // User attempting the booking
        busId: string; // Bus ID involved
        seats: number[]; // Seats requested
        reason: string; // Reason for the failure
        version: number; // Version for concurrency control
    };
}
