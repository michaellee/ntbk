/**
 * Pad value with zero if it is less than 10
 * @param {Number} value
 * @return passes the value through if it is greater 9 and retains type number,
 * if value is less than 10 than a string is returned
 */
var addZero = function (value) {
  value = value < 10 ? '0' + value : value
  return value
}

/**
 * Pluralizes unit name
 * @param {Number} value
 * @param {String} unit
 * @return {String} units or unit
 */
var pluralizeUnit = function (value, unit) {
  return value > 1 ? unit + 's' : unit
}

module.exports = {
  addZero,
  pluralizeUnit
}
