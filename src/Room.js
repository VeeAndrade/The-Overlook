class Room {
  constructor(suite) {
    this.number = suite.number,
    this.roomType = suite.roomType,
    this.bidet = suite.bidet,
    this.bedSize = suite.bedSize,
    this.numBeds = suite.numBeds,
    this.costPerNight = suite.costPerNight
  }
}

export default Room;