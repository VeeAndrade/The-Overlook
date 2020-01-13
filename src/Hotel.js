class Hotel {
  constructor(rooms, bookings) {
    this.rooms = rooms,
    this.bookings = bookings 
  }

  getUserBookings(id) {
    return this.bookings.filter(booking => booking.userID === id)
  }

  filterRoom() {
    
  }
}

export default Hotel;