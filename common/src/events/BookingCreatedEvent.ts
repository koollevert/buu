import { Subjects } from "./subjects";

export interface BookingCreatedEvent {
    subject: Subjects.BookingCreated;
    data: {
        id: string;
        userId: string;
        busId: string;
        seats: number[];
        amount: number;
        expiresAt: string; 
        version: number; 
    };
}
