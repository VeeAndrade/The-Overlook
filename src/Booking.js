class Booking {
  constructor(reservation) {
    this.id = reservation.id,
    this.userID = reservation.userID,
    this.date = reservation.date,
    this.roomNumber = reservation.roomNumber,
    this.roomServiceCharges = reservation.roomServiceCharges
  }
}

export default Booking;