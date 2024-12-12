export enum BookingStatus {
    Created = 'created', // Booking has been created but seats are not yet reserved
    Cancelled = 'cancelled', // Booking has been cancelled by the user or due to expiration or unavailability
    AwaitingPayment = 'awaiting:payment', // Seats have been reserved successfully, waiting for payment
    Complete = 'complete', // Booking is finalized with successful payment
}
