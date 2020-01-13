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
    })
}

if (window.location.href.includes("userId")) {
  urlString = window.location.href
  url = new URL(urlString)
  userId = url.searchParams.get('userId')
  getUserDashBoard(userId)
  // $('.booking-date-button').on('click', filterRooms)
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
        let room = rooms.find(room => room.number === booking.roomNumber)
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

  