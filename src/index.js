// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
// import './main-client'
// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import '../src/css/base.scss'
import '../src/main-client'
import '../src/main-manager'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/cherry-blossom-background-4.jpg'
import Hotel from './Hotel';

let hotel;
let userId;

$('.user-login-button').click(findOutWhoTheUserIs)
$('.manager-login-button').click(findOutWhoTheUserIs)
// $('.user-login-button').click(resolveAllPromises)
// $('.manager-login-button').click(resolveAllPromises)
// $('.')

function findOutWhoTheUserIs() {
  let userValue = $('.user-input-bar').val();
  if(userValue === 'manager') {
    window.location.href = './manager.html'
  } else if (userValue.includes('customer')) {
    let userInput = userValue.split('r')
    userId = userInput[1];
    window.location.href = './client.html?userId=' + userId
  }
}
