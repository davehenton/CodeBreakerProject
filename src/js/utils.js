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
