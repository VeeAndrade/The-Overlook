class Hotel {
  constructor(rooms, bookings, users) {
    this.rooms = rooms,
    this.bookings = bookings 
    this.users = users
  }

  getUserBookings(id) {
    return this.bookings.filter(booking => booking.userID === id)
  }

  getTodaysAvailableRooms(date) {
    let availableRooms = [];
    let bookedRooms = this.bookings.filter(booking => booking.date === date)
      this.rooms.forEach(room => {
        let booked = bookedRooms.find(bookedroom => bookedroom.roomNumber === room.number)
        if (booked === undefined) {
          availableRooms.push(room);
        }
      })
      return availableRooms;
  }

  getTodaysRevenue(date) {
    let bookedRooms = this.bookings.filter(booking => booking.date === date)
    let total = this.rooms.reduce((acc, room) => {
      bookedRooms.forEach(bookedRoom => {
        if (bookedRoom.roomNumber === room.number){
          acc += room.costPerNight
        }
      })
      return acc
    }, 0).toFixed(2)
    return Number(total);
  }

  getPercentageOfOccupiedRooms(date) {
    let availableRooms = this.getTodaysAvailableRooms(date).length;
    let roomCount = this.rooms.length;
    return ((roomCount - availableRooms) / roomCount) * 100;
  }

  retrieveUsersBookings(id) {
    return this.bookings.filter(booking => booking.userID === id)
  }


}

export default Hotel;