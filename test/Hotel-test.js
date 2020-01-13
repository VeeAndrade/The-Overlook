import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/Hotel';
import Booking from '../src/Booking';

describe('Hotel', () => {
  let hotel, rooms, booking1, booking2, bookings, user

  beforeEach(() => {
    user = {"id": 1, "name": "Leatha Ullrich"},
    rooms = [
      {"number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 358.4},
      {"number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2, "costPerNight": 477.38},
      {"number": 3, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1, "costPerNight": 491.14},
      {"number": 4, "roomType": "single room", "bidet": false, "bedSize": "queen", "numBeds": 1, "costPerNight": 429.44},
      {"number": 5, "roomType": "single room", "bidet": true, "bedSize": "queen", "numBeds": 2, "costPerNight": 340.17}
    ],
    booking1 = new Booking({"id": "5fwrgu4i7k55hl6tb", "userID": 1, "date": "2020/02/02", "roomNumber": 3, "roomServiceCharges": []}), 
    booking2 = new Booking({"id": "5fwrgu4i7k55hl6ta", "userID": 2, "date": "2020/02/05", "roomNumber": 4, "roomServiceCharges": []}),
    bookings = [booking1]
    hotel = new Hotel(rooms, bookings)
  });

  it('should keep track of all it\'s rooms', () => {
    expect(hotel.rooms).to.eql(rooms)
  });

  it('should keep track of all it\'s bookings', () => {
    expect(hotel.bookings).to.eql(bookings)
  });

  it('should be able to get the users bookings', () => {
    booking1 = [{"id": "5fwrgu4i7k55hl6tb", "userID": 1, "date": "2020/02/02", "roomNumber": 3, "roomServiceCharges": []}]
    expect(hotel.getUserBookings(1)).to.eql(booking1)
  })
})