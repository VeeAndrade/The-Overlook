import chai from 'chai';
const expect = chai.expect;
import Room from '../src/Room';

describe('Room', () => {
   let room, suite

   beforeEach(() => {
     suite = { "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 358.4}
     room = new Room(suite)
   });

   it('should have a room number', () => {
    expect(room.number).to.equal(1)
   });

   it('should have a room type', () => {
     expect(room.roomType).to.equal('residential suite')
   });

   it('should tell you if there is a bidet', () => {
     expect(room.bidet).to.equal(true)
   });

   it('should tell you the bed size', () => {
     expect(room.bedSize).to.equal('queen')
   });

   it('should have a room number', () => {
     expect(room.numBeds).to.equal(1)
   });

   it('should have a room number', () => {
     expect(room.costPerNight).to.equal(358.4)
   });
});