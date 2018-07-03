const MAX_NUM = 10000;

function $(selector, container) {
  return (container || document).querySelector(selector);
}

let answer = $('#answer');
let attempt = $('#attempt');

/**
 * guess The main method of the game
 */
function guess() {
  let input = $('#user-guess');

  //Only set the answer and attempt hidden inputs when they aren't already set
  if (answer.value === '' || attempt.value === '') {
    setHiddenFields();
  }

  //validateInput if the length of the input is not 4
  if (!validateInput(input.value)) {
    return;
  }

  // increment the number of attempts
  attempt.value++;

  if (getResults(input.value)) {     //if the user has guessed correctly
    setMessage('You Win! :)');
    showAnswer(true);
    showReplay();
  } else if (attempt.value >= 10) { //if the user has exceed the number of attempts
    setMessage('You Lose! :(');
    showAnswer(false);
    showReplay();
  } else {
    setMessage('Incorrect, try again.'); //otherwise keep playing
  }
}

/**
 * getRandomInt randomly generated an integer between 0 and max number
 * @param max maximum number within which generate the random number
 * @returns {number} the random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * setHiddenFields Set the answer variable equal to a randomly generated whole number between 0 and 9999
 */
function setHiddenFields() {
  // Set the hidden input attempt's value to zero
  attempt.value = 0;

  // Sets the answer variable equal to a randomly generated whole number between 0 and 9999
  answer.value = getRandomInt(MAX_NUM).toString();

  // Make sure the hidden input answer's value is exactly 4 characters long
  while (answer.value.length < 4) {
    answer.value = `0${answer.value}`;
  }
}

/**
 * setMessage Set the #message label to whatever is provided to the parameter
 * @param message
 */
function setMessage(message) {
  document.getElementById('message').innerHTML = message;
}

/**
 * validateInput Validates the length of the parameter input
 * @param input The String that needs validating
 * @returns {boolean} If the parameter has a `length` of 4, return `true` —
 *                    otherwise return `false`
 */
function validateInput(input) {
  if (input.length !== 4) {
    // use the `setMessage` function to set the `message` label to `"Guesses must be exactly 4 characters long."`,
    setMessage('Guesses must be exactly 4 characters long.');
    return false;
  }
  return true;
}

/**
 * getResults Add the results of the user's guess to our `results` div's `innerHTML`
 * @param input The value the user guessed
 * @returns {boolean} If all characters were guessed correctly, the function return `true`, otherwise `false`
 */
function getResults(input) {
  //create html to insert into #results
  let html = `<div class="row"><span class="col-md-6">${input}</span><div class="col-md-6">`;

  //for each character
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === answer.value.charAt(i)) {

      //if the character is in the correct position in the `answer`
      html += '<span class="glyphicon glyphicon-ok"></span>'; //add icon ok
    } else if (answer.value.indexOf(input.charAt(i)) > -1) {

      //if the character is in the `answer` but isn't in the right position
      html += '<span class="glyphicon glyphicon-transfer"></span>'; //add icon transfer
    } else {

      //if the number isn't in the `answer` at all
      html += '<span class="glyphicon glyphicon-remove"></span>'; //add icon remove
    }
  }

  //close html tags
  html += '</div></div>';

  //append the html to the #return element
  document.getElementById('results').innerHTML += html;

  return input === answer.value;
}

/**
 * showAnswer Display the Answer and updates the UI according to the parameter value
 * @param success true if the player has won, false otherwise
 */
function showAnswer(success) {
  let code = document.getElementById('code');

  if (success) {
    code.className += ' success';
  } else {
    code.className += ' failure';
  }

  code.innerHTML = answer.value;
}

/**
 * showReplay Change the UI so the user can start over after they win or lose the game
 */
function showReplay() {
  document.getElementById('guessing-div').style.display = 'none';
  document.getElementById('replay-div').style.display = 'block';
}
