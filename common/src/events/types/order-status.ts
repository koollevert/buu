export enum OrderStatus{
    Created='created', //order created but ticket it is trying to order not reserved
    Cancelled= 'cancelled',// ticket the order is trying to reserve has already been reserved, or when the user has cancelled the order also expiration before payment
    AwaitingPayment='awaiting:payment', //succesful ticket reservation
    Complete='complete', //order reserved the ticket and user has provided payment successful
}