'use strict';

/**
 * $ returned the document or container selector specified
 * @param {string} selector The selector to look for in the container
 * @param {string} container The dom container
 * @return {object} The html for the specified selector
 */
function $(selector, container) {
  return (container || document).querySelector(selector);
}

/**
 * getRandomInt randomly generated an integer between 0 and max number
 * @param {number} max Maximum number within which generate the random number
 * @return {number} the random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * setMessage Set the #message label to whatever is provided to the parameter
 * @param {object} querySelector
 * @param {string} message
 */
function setMessage(querySelector, message) {
  querySelector.innerHTML = message;
}

/**
 * validateInputLength Validates the length of the parameter input
 * @param {string} string The String that needs validating
 * @param {number} number The length to validate the input against
 * @return {boolean} If the parameter has a `length` of num, return `true` —
 *                    otherwise return `false`
 */
function validateStringLength(string, number) {
  return string.length === number;
}

/**
 * toggleClass Toggles the className of a selector
 * @param {object} querySelector The query selector on witch perform the toggle function
 * @param {string} className The name of the class to toggle
 */
function toggleClass(querySelector, className) {
  if (querySelector.classList) {
    querySelector.classList.toggle(className);
  } else {
    // For IE9
    var classes = querySelector.className.split(" ");
    var i = classes.indexOf(className);

    if(i >= 0)
      classes.splice(i, 1);
    else
      classes.push(className);
    querySelector.className = classes.join(" ");
  }
}

