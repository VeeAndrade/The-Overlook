import $ from 'jquery'
import moment from 'moment'
import Hotel from './Hotel';
import Booking from './Booking';
import Room from './Room';

let url, urlString, userId, hotel

function fetchUserData(id) {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
    .then(response => response.json())
    .then(data => data.users.find(user => user.id === Number(id)))
    .catch(error => console.log(error))
}

function fetchBookingData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
    .then(response => response.json())
    .then(data => data.bookings)
    .catch(error => console.log(error))
}

function fetchRoomData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
    .then(response => response.json())
    .then(data => data.rooms)
    .catch(error => console.log(error))
}

function getUserDashBoard(id) {
  Promise.all([fetchRoomData(), fetchBookingData(), fetchUserData(id)])
    .then(value => {
      let user = value[2]
      let bookings = value[1].map(booking => new Booking(booking))
      let rooms = value[0].map(room => new Room(room))
      hotel = new Hotel(rooms, bookings);
      welcomeUser(user.name)
      let userBookings = hotel.getUserBookings(user.id)
      let todaysDate = moment().format('YYYY/MM/DD')
      $('.booking-input-field').attr('min', todaysDate.split('/').join('-'))
      getPastBookingsOnDom(userBookings, hotel.rooms, todaysDate)
      $('.booking-date-button').on('click', {bookings: bookings, rooms: rooms}, filterRoomsAvailableByDate)
    })
}

if (window.location.href.includes("userId")) {
  urlString = window.location.href
  url = new URL(urlString)
  userId = url.searchParams.get('userId')
  getUserDashBoard(userId)
}

function welcomeUser(name) {
  $('.client-welcome-heading').text(`Welcome ${name.split(' ')[0]}`)
}

function getPastBookingsOnDom(bookings, rooms, todaysDate) {
  let upcomingBookings = bookings.filter(booking => booking.date >= todaysDate)
    postUpcomingBookings(upcomingBookings, rooms)
  let pastBookings = bookings.filter(booking => booking.date < todaysDate)
  pastBookings.forEach(booking => {
    let room = rooms.find(room => room.number === booking.roomNumber) 
        $('.previous-booking-display').append(`
        <div class="single-booking-info">
        <div class="booking-detail-top">
        <p class="left-side-detail">Date: ${booking.date}</p>
        <p class="right-side-detail">Rm#: ${booking.roomNumber}</p>
        </div>
        <div class="booking-detail-middle">
        <p class="left-side-detail">Type: ${room.roomType}</p>
        <p class="right-side-detail">Number of Beds: ${room.numBeds}</p>
        </div>
        <div class="booking-detail-bottom">
        <p class="left-side-detail">Bedsize: ${room.bedSize}</p>
        <p class="right-side-detail">Cost: $${room.costPerNight}</p>
        </div>
        </div>`)
  
    })
  calculateBookingCosts(pastBookings, rooms)
}

  function postUpcomingBookings(bookings, rooms) {
    let upcomingBookings = bookings.sort((a, b) => new Date(a.date) - new Date(b.date))
      upcomingBookings.forEach(booking => {
        let room = rooms.find(room => room.number === Number(booking.roomNumber))
          $('.upcoming-bookings-display').append(`
      <div class="single-upcoming-info">
      <div class="upcoming-detail-top">
      <p class="left-side-detail">Date: ${booking.date}</p>
      <p class="right-side-detail">Rm#: ${booking.roomNumber}</p>
      </div>
      <div class="upcoming-detail-middle">
      <p class="left-side-detail">Type: ${room.roomType}</p>
      <p class="right-side-detail">Number of Beds: ${room.numBeds}</p>
      </div>
      <div class="upcoming-detail-bottom">
      <p class="left-side-detail">Bedsize: ${room.bedSize}</p>
      <p class="right-side-detail">Cost: $${room.costPerNight}</p>
      </div>
      </div>
      `)
      })
  }

  function calculateBookingCosts(pastbookings, rooms) {
    let cost = pastbookings.reduce((acc, sum) => {
      let room = rooms.find(room => room.number === sum.roomNumber)
      acc += room.costPerNight
      return acc;
    }, 0)
    if(typeof(cost) !== 'number') {
      let cost = 0.00;
      $('.booking-summary-cost').text(`Total Amount Spent: $${cost}`);
    } else {
      $('.booking-summary-cost').text(`Total Amount Spent: $${cost}`);
    }
  }

  function filterRoomsAvailableByDate(jqueryEvent) {
    event.preventDefault();
    let availableRooms = [];
    let date = $('.booking-input-field').val().split('-').join('/')
    let bookedRooms = jqueryEvent.data.bookings.filter(booking => booking.date === date)
      jqueryEvent.data.rooms.forEach(room => {
        let booked = bookedRooms.find(bookedroom => bookedroom.roomNumber === room.number)
        if(booked === undefined) {
          availableRooms.push(room);
        }
      })
    if(availableRooms.length === 0 ) {
      $('.room-booking-container').css('display', 'none')
      $('.fierce-apology-container').css('display', 'flex')
      $('.fierce-apology-container').append(
      `<section class="fierce-apology-paragraph-section">
            <p class="fierce-apology-paragraph">I'm sorry to inform you that The Cherry Blossom Hotel is overbooked on
              ${date} and your selected room is no longer available. We regret the error during such a busy 
              travel time. Please accept our sincerest apologies for the inconvenience.</p>
          </section>`)
    } else {
      $('.fierce-apology-container').css('display', 'none')
      $('.room-booking-container').css('display', 'flex')
      availableRooms.forEach(room => {
        $('.rooms-available-display').append(`
        <div class="single-room-info" id="${room.number}">
        <div class="single-room-heading-wrapper">
        <h6 class="single-room-heading">${room.roomType}</h6>
        </div>
        <section class="single-room-description">
        <p class="single-room-text">Our ${room.roomType}  provides views over landscaped gardens. Room number ${room.number} has a
        seating area, ample storage, digital safe, minibar, and luxurious duck down bedding.This room
        comes with ${room.numBeds} ${room.bedSize} bed and may or may not have a bidet. The entire suite is designed in a fashion to
        allow mobility impaired accessibility. Price per night: ${room.costPerNight}</p>
        <button class="book-room-button">Select Room</button>
        </section>
        </div>
        `)
      })
      $('.submit-option-button').on('click', {availableRooms: availableRooms, date: date}, filterRoomByType)
    }
  }
  
  function filterRoomByType(jqueryEvent) {
    let rooms = jqueryEvent.data.availableRooms;
    let date = jqueryEvent.data.date;
    let selectedOption = $('.select-container').val()
    $('.rooms-available-display').text('')
    rooms.forEach(room => {
      if(room.roomType === selectedOption) {
        $('.rooms-available-display').append(`
        <div class="single-room-info" id="${room.number}">
        <div class="single-room-heading-wrapper">
        <h6 class="single-room-heading">${room.roomType}</h6>
        </div>
        <section class="single-room-description">
        <p class="single-room-text">Our ${room.roomType}  provides views over landscaped gardens. Room number ${room.number} has a
        seating area, ample storage, digital safe, minibar, and luxurious duck down bedding.This room
        comes with ${room.numBeds} ${room.bedSize} bed and may or may not have a bidet. The entire suite is designed in a fashion to
        allow mobility impaired accessibility. Price per night: ${room.costPerNight}</p>
        <button class="book-room-button">Select Room</button>
        </section>
        </div>
        `)
      }
    })
    urlString = window.location.href
    url = new URL(urlString)
    userId = url.searchParams.get('userId')
    $('.book-room-button').on('click', {date: date, userId: userId}, selectRoom)
  }

  function selectRoom(jqueryEvent) {
    fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userID": Number(jqueryEvent.data.userId),
        "date": jqueryEvent.data.date,
        "roomNumber": Number(jqueryEvent.target.parentNode.parentNode.id)
      })
    })
    .catch(error => console.log(error))
    $('.single-room-info').css('display', 'none');
    $('.rooms-available-display').append(`
    <section class="room-booked-section"> 
    <p class="booked-reservation-message">Your reservation has been confirmed for room ${jqueryEvent.target.parentNode.parentNode.id} on the ${jqueryEvent.data.date}</p>
    </section>
    `)
  }