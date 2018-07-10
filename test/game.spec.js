'use strict';

/* eslint func-names: 0 */

describe('Calculator', function() {
  // // inject the HTML fixture for the tests
  beforeEach(function() {
    // Why this line? See: https://github.com/billtrik/karma-fixture/issues/3
    fixture.base = 'test';
    fixture.load('game.fixture.html');

    // init js lib
    window.game.start();
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    fixture.cleanup();
  });

  it('should set the `value` of element `answer` to empty string', function() {
    $('#answer').value.should.equal('');
  });

  describe('setHiddenFields()', function() {
    it('should set the `value` of element `answer` to a random whole number between 0 and 9999. @randomNumber', function() {
      assert(typeof $('#answer').value === 'string', '`answer.value` is not of type string.');

      var array = [];
      var i = 0;

      for (i; i < 10; i++) {
        $('#guess').click();
        array.push($('#answer').value);
        $('#reload').click();
      }

      array.sort();

      assert(array.length > 0, '`setHiddenFields` didn\'t change the `value` of the `answer` hidden field. `setHiddenFields` should change the `answer.value` variable.');
      var current = null;
      var duplicates = 0;
      for (i = 0; i < array.length; i++) {
        assert(array[i] >= 0 && array[i] <= 9999, '`answer.value` was ' + array[i] + ' which is not between 0 and 9999.');
        assert(array[i].indexOf('.') === -1, '`answer.value` was ' + array[i] + ' which is not a whole number.');
        if (array[i] !== current) {
          current = array[i];
        } else {
          duplicates++;
        }
      }
      assert(duplicates < 3, '`setHiddenFields` was run 10 times and `answer.value` was the same more than 3 times. `answer.value` does not appear to be random.');
    });
    it('should set the `value` of element `answer` to a number exactly 4 characters long. @answerLength', function() {
      var array = [];
      var i = 0;

      for (i; i < 10; i++) {
        $('#guess').click();
        array.push($('#answer').value);
        $('#reload').click();
      }

      array.sort();

      assert(array.length > 0, '`setHiddenFields` didn\'t change the `value` of the `answer` hidden field. `setHiddenFields` should change the `answer.value` variable.');
      for (i = 0; i < array.length; i++) {
        assert(array[i].length === 4, 'The `value` of the element `answer` was ' + array[i] + ' which is not exactly 4 characters long.');
      }
    });
    it('should set the `value` of element `attempt` to 0. @setAttempt', function() {
      $('#guess').click();
      assert($('#attempt').value === '0', 'The `value` of element `attempt` was "' + $('#attempt').value + '" which is not 0.');
    });
    it('should only run if the `value` of elements `attempt` or `answer` are empty. @preventClearing', function() {
      $('#guess').click();
      var expectedAnswer = $('#answer').value;
      assert(expectedAnswer !== '', '`setHiddenFields` didn\'t change the `value` of the `answer` hidden field. `setHiddenFields` should change the `answer.value` variable.');
      assert(expectedAnswer === $('#answer').value, 'the `value` of element `answer` was changed even though `answer` had already been provided a `value`. Only update the `value` of `answer` when answer is empty; `(\'\')`');
    });
  });
  describe('setMessage()', function() {
    it('should set element `message` to incorrect string value message. @setMessage', function() {
      $('#guess').click();

      assert($('#message').innerHTML === 'Guesses must be exactly 4 characters long.', 'test `setMessage` function.', '`message`s `innerHTML` did not match the provided value.');
    });
    it('should set element `message` to incorrect value message. @setMessage', function() {
      $('#user-guess').value = '0123';
      $('#guess').click();

      assert($('#message').innerHTML === 'Incorrect, try again.', 'test `setMessage` function.', '`message`s `innerHTML` did not match the incorrect value message.');
    });
    it('should set element `message` to winning message. @setMessage', function() {
      $('#guess').click();
      $('#user-guess').value = $('#answer').value;
      $('#guess').click();

      assert($('#message').innerHTML === 'You Win! :)', 'test `setMessage` function.', '`message`s `innerHTML` did not match the winning message.');
    });
    it('should set element `message` to loosing message. @setMessage', function() {
      $('#user-guess').value = '0000';

      for (var i = 0; i < 10; i++) {
        $('#guess').click();
      }

      assert($('#message').innerHTML === 'You Lose! :(', '`message`s `innerHTML` did not match the loosing message.');
    });
  });

  describe('validateInput()', function() {
    it('should accept one parameter and return `true` only when that parameter\'s `length` is 4. @validateInput', function() {
      $('#user-guess').value = '0000';
      $('#guess').click();
      assert($('#message').innerHTML === 'Incorrect, try again.', 'test `setMessage` function.', '`message`s `innerHTML` did not match the provided value.');

      $('#user-guess').value = '123';
      $('#guess').click();
      assert($('#message').innerHTML === 'Guesses must be exactly 4 characters long.', 'test `setMessage` function.', '`message`s `innerHTML` did not match the provided value.');
    });

    it('should run when `guess` runs @runValidation', function() {
      var attempt = $('#attempt');
      assert(attempt.value === '', 'The `value` of `attempt` increased when `validateInput` returned `false`, this should only iterate when `validateInput` returns `true`.');
      $('#user-guess').value = '0000';
      $('#guess').click();
      assert(attempt.value === '1', 'The `value` of `attempt` should increase by 1 when `validateInput` returns `true`.');
    });
  });

  describe('getResults() @getResults', function() {
    it('should accept one parameter and add to the `results` element\'s `innerHTML` based on how close the parameter is to the value of element `answer`. \n\tEach result should begin with `<div class="row"><span class="col-md-6">\' + input + \'</span><div class="col-md-6">` where `input` is the function\'s parameter. \n\tForeach character in `input`: add `<span class="glyphicon glyphicon-ok"></span>` \n\tif the character is in the element `answer`\s `value` and in the correct position, add `<span class="glyphicon glyphicon-transfer"></span>` \n\tif the character is in element `answer`\`s `value`, but is not in the correct position, and add `<span class="glyphicon glyphicon-remove"></span>` \n\tif the character is not in `answer`\'s `value` at all. @getResults', function() {
      var guess = $('#guess');
      var results = $('#results');

      guess.click();
      $('#answer').value = '1234';

      $('#user-guess').value = '1300';
      guess.click();

      var oks = (results.innerHTML.match(/glyphicon-ok/g) || []).length;
      var transfers = (results.innerHTML.match(/glyphicon-transfer/g) || []).length;
      var removes = (results.innerHTML.match(/glyphicon-remove/g) || []).length;

      assert(oks > 0, 'correct characters are not being marked as correct.');
      assert(oks < 2, 'some characters are being incorrectly marked as correct.');
      assert(transfers > 0, 'characters that were present in the answer, but not in the right position are not getting marked correctly.');
      assert(transfers < 2, 'some characters are being incorrectly marked as in the answer, but not in the right position.');
      assert(removes > 1, 'characters not present in the answer are not being marked as wrong.');
      assert(removes < 3, 'some characters are being incorrectly marked as not in the answer.');
    });
  });

  describe('showAnswer()', function() {
    it('should accept one parameter and set the `innerHTML` of element `code` to match element `answer`\'s value. If parameter is `true` element `code` should have ` success` added to it\'s `className`. (Note: the spaces before ` success`) @showAnswer', function() {
      var code = $('#code');
      var answer = $('#answer');
      // test true
      var guess = $('#guess');
      guess.click();
      $('#user-guess').value = answer.value;
      guess.click();

      assert(answer.value === code.innerHTML, '`code`\'s `innerHTML` did not match the `answer`\'s value when parameter was `true`.');
      assert(code.className.indexOf(' success') !== -1, '`code`\'s `className` did not have ` success` in it when parameter was `true`.');
    });
    it('should accept one parameter and set the `innerHTML` of element `code` to match element `answer`\'s value. If parameter is `false` element `code` should have ` failure` added to it\'s `className`. (Note: the spaces before ` failure` are required) @showAnswer', function() {
      var code = $('#code');

      $('#user-guess').value = '0000';

      for (var i = 0; i < 10; i++) {
        $('#guess').click();
      }

      assert($('#answer').value === code.innerHTML, '`code`\'s `innerHTML` did not match the `answer`\'s value when parameter was `false`.');
      assert(code.className.indexOf(' failure') !== -1, '`code`\'s `className` did not have ` failure` in it when parameter was `false`.');
    });
  });

  describe('showReplay()', function() {
    it('should set element `guessing-div`\'s `style` to "display:none" element `replay-div`\'s `style` to "display:block" if win. @showReplay', function() {
      var guess = $('#guess');
      guess.click();
      $('#user-guess').value = $('#answer').value;
      guess.click();

      assert($('#guessing-div').className.split(' ').indexOf('hidden') !== -1, '`guessing-div`\'s `class` was not set to "hidden" class.');
      assert($('#replay-div').className.split(' ').indexOf('hidden') === -1, '`replay-div`\'s `class` was not set to "display:block".');
    });

    it('should set element `guessing-div`\'s `style` to "display:none" element `replay-div`\'s `style` to "display:block" if lost. @showReplay', function() {
      $('#user-guess').value = '0000';

      for (var i = 0; i < 10; i++) {
        $('#guess').click();
      }

      assert($('#guessing-div').className.split(' ').indexOf('hidden') !== -1, '`guessing-div`\'s `class` was not set to "hidden" class.');
      assert($('#replay-div').className.split(' ').indexOf('hidden') === -1, '`replay-div`\'s `class` was not set to "display:block".');
    });
  });

  describe('reset()', function() {
    beforeEach(function() {
      var guess = $('#guess');
      guess.click();
      $('#user-guess').value = $('#answer').value;
      guess.click();

      $('#reload').click();
    });
    it('should set the answer value to zero. @reset', function() {
      assert($('#answer').value === '', '`answer.value` was not set to an empty string.');
    });
    it('should set the message to empty string. @reset', function() {
      assert($('#attempt').value === '', '`attempt.value` was not set to to an empty string.');
    });
    it('should reset guesses and results. @reset', function() {
      assert($('#results').children.length === 1, 'the results and guesses column html where not removed from the dom');
    });
    it('should set element `guessing-div`\'s `style` to "display:block" element `replay-div`\'s `style` to "display:none" if lost. @reset', function() {
      assert($('#guessing-div').className.split(' ').indexOf('hidden') === -1, '`guessing-div`\'s `class` was not set to "hidden" class.');
      assert($('#replay-div').className.split(' ').indexOf('hidden') !== -1, '`replay-div`\'s `class` was not set to "display:block".');
    });
  });
});
