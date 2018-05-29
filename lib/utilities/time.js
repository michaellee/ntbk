/**
 * Returns current date and time in format of YYYY-MM-DD HH:MM
 * @return {String} now
 */
var getTime = function () {
  var timestamp = new Date()
  var now = timestamp.getFullYear() + '-' + stringUtilities.addZero((timestamp.getMonth() + 1)) + '-' + stringUtilities.addZero(timestamp.getDate()) + ' ' + stringUtilities.addZero(timestamp.getHours()) + ':' + stringUtilities.addZero(timestamp.getMinutes())
  return now
}

module.exports = {
  getTime
}
