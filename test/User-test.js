import chai from 'chai';
const expect = chai.expect;
import User from '../src/User';

describe('User', () => {

  let user, client

  beforeEach(() => {
    client = {"id": 1, "name": "Leatha Ullrich"}
    user = new User(client)
  });

  it('should have an id', () => {
    expect(user.id).to.equal(1)
  });

  it('should have a name', () => {
    expect(user.name).to.equal("Leatha Ullrich")
  });

  // it('should be able to book a room', () => {
  //   expect(user.bookedRooms).to.eql([])
  // });
})