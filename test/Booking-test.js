import chai from 'chai';
const expect = chai.expect;
import Booking from '../src/Booking';

describe('Booking', () => {
  let booking, reservation

  beforeEach(() => {
    reservation = {
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 9,
      "date": "2020/02/04",
      "roomNumber": 15,
      "roomServiceCharges": [
      ]},
    booking = new Booking(reservation)
  });

  it('should have an id', () => {
    expect(booking.id).to.equal('5fwrgu4i7k55hl6sz')
  });

  it('should have a userID', () => {
    expect(booking.userID).to.equal(9)
  });

  it('should have a data', () => {
    expect(booking.date).to.equal('2020/02/04')
  });

  it('should have a roomNumber', () => {
    expect(booking.roomNumber).to.equal(15)
  });

  it('should have an array of room service charges', () => {
    expect(booking.roomServiceCharges).to.eql([])
  });
})