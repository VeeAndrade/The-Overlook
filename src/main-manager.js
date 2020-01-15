import $ from 'jquery';
import moment from 'moment';
import Hotel from './Hotel'
import Booking from './Booking';
import Room from './Room';
import User from './User'

if(window.location.href.includes('manager')) {
  console.log('manager')
  getManagerDashBoard()
}

function fetchUserData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
    .then(response => response.json())
    .then(data => data.users)
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

function getManagerDashBoard() {
  Promise.all([fetchRoomData(), fetchBookingData(), fetchUserData()])
    .then(value => {
      let bookings = value[1].map(booking => new Booking(booking))
      let rooms = value[0].map(room => new Room(room))
      let users = value[2].map(user => new User(user))
      let hotel = new Hotel(rooms, bookings, users);
      let todaysDate = moment().format('YYYY/MM/DD')
      populateManagersAvailableRooms(todaysDate, hotel)
      populateTopContainer(todaysDate, hotel)
      $('.search-booking-button').on('click', {hotel: hotel}, findRoomsAvailableForUser)
      $('.manager-booking-date').attr('min', todaysDate.split('/').join('-'))
      $('.search-username-button').on('click', {hotel: hotel}, populateUserInfoOnManager)
    })
}

function populateManagersAvailableRooms(date, hotel) {
  let availableRooms = hotel.getTodaysAvailableRooms(date);
  availableRooms.forEach(room => {
    $('.rooms-available-container').append(`
      <section class="rooms-display">
        <div class="single-room">
          <p class="room-detail">Room #${room.number}</p>
          <p class="room-detail">Type: ${room.roomType}</p>
        </div>
      </section>
    `)
  })
}

function populateTopContainer(todaysDate, hotel) {
  let revenue = hotel.getTodaysRevenue(todaysDate)
  let percentage = hotel.getPercentageOfOccupiedRooms(todaysDate)
  $('.dollar-text').text(`$${revenue}`);
  $('.percentage-text').text(`${percentage}%`);
  $('.column-label-date').text(`${todaysDate}`);
}


function populateUserInfoOnManager(jqueryEvent) {
  event.preventDefault()
  let userValue = $('.customer-username-input').val()
  let userInput = userValue.split('r')
  let userId = Number(userInput[1]);
  let usersBookings = jqueryEvent.data.hotel.retrieveUsersBookings(userId)
  usersBookings.forEach(booking => {
    let room = jqueryEvent.data.hotel.rooms.find(room => room.number === booking.roomNumber)
      $('.customer-past-future-booking-container').append(
      `<div class="manager-booking-info" id="${booking.id}">
        <div class="booking-detail-first">
        <p class="top-last-detail">Date: ${booking.date}</p>
        <p class="bottom-last-detail">Rm#: ${booking.roomNumber}</p>
        </div>
        <div class="booking-detail-mid">
        <p class="top-last-detail">Type: ${room.roomType}</p>
        <p class="bottom-last-detail">Number of Beds: ${room.numBeds}</p>
        </div>
        <div class="booking-detail-last">
        <p class="top-last-detail">Bedsize: ${room.bedSize}</p>
        <p class="bottom-last-detail">Cost: $${room.costPerNight}</p>
        </div>
        <div class="booking-delete-btn">
        <button class="delete-reservation-button">Delete</button>
        </div>
        </div>
        `)
  })
  $('.delete-reservation-button').on('click', {usersBookings: usersBookings}, deleteReservation)
}

function findRoomsAvailableForUser(jqueryEvent) {
  event.preventDefault()
  $('.customer-past-future-booking-container').text('');
  let availableRooms = [];
  let date = $('.manager-booking-date').val().split('-').join('/');
  let bookedRooms = jqueryEvent.data.hotel.bookings.filter(booking => booking.date === date)
  jqueryEvent.data.hotel.rooms.forEach(room => {
        let booked = bookedRooms.find(bookedroom => bookedroom.roomNumber === room.number)
        if (booked === undefined) {
          availableRooms.push(room);
        }
      })
    if (availableRooms.length === 0) {
      console.log('no rooms available')
    } else {
      populateAvailableRoomsToBook(availableRooms, date);
    }
}

 function populateAvailableRoomsToBook(availableRooms, date) {
   let userValue = $('.customer-username-input').val()
   let userInput = userValue.split('r')
   let userId = Number(userInput[1])
   availableRooms.forEach(room => {
     $('.customer-past-future-booking-container').append(`
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
   $('.book-room-button').on('click', {date: date, userId: userId}, bookRoomForClient)
 }

 function bookRoomForClient(jqueryEvent) {
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
   $('.customer-past-future-booking-container').append(`
    <section class="room-reserved-section"> 
    <p class="booked-reservation-message">Your reservation has been confirmed for room ${jqueryEvent.target.parentNode.parentNode.id} on the ${jqueryEvent.data.date}</p>
    </section>
    `)
 }

 function deleteReservation(jqueryEvent) {
  let bookingId = event.target.parentNode.parentNode.id
  let reservation = jqueryEvent.data.usersBookings.find(booking => booking.id === bookingId)
  let date = moment().format('YYYY/MM/DD')
    if (reservation.date > date) {
      fetch(' https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: `${bookingId}`
        })
      })
      .then(resolved => resolved.json())
      .catch(error => console.log(error))
      $('.manager-booking-info').css('display', 'none');
      $('.customer-past-future-booking-container').append(`
    <section class="room-reserved-section"> 
    <p class="booked-reservation-message">Your reservation has been cancelled successfully</p>
    </section>
    `)
    } else {
      $('.manager-booking-info').css('display', 'none');
      $('.customer-past-future-booking-container').append(`
    <section class="room-reserved-section"> 
    <p class="booked-reservation-message">You can't delete/cancel a past reservation, try again.</p>
    </section>
    `)
    }
  }