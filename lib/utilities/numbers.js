var emojic = require('emojic')

/**
 * Returns random integer
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * Emojifies number
 * @param {Number} number
 * @return {String} emojified number
 */
var emojifyNumber = function (number) {
  var numbers = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
  }

  // Seperates each digit in the number into an array
  var digits = number.toString(10).split('').map(function (t) {return parseInt(t)})

  // Iterates through the digits and emojifies them
  for (var i = 0; i < digits.length; i++) {
    digits[i] = eval('emojic.' + numbers[digits[i]])
  }

  // Joins the emojified digits into a combined emoji number
  var emojifiedNumber = digits.join(' ')
  return emojifiedNumber
}

module.exports = {
  getRandomInt,
  isNumber,
  emojifyNumber
}
