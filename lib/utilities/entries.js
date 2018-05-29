var fs = require('fs')

/**
 * Returns all entries as an array
 * @return {Array} lines
 */
var getEntries = function (obj) {
  var entries = fs.readFileSync(obj.notebooks.default, 'utf8')
  // Regex to split the string by entries into an array
  var lines = entries.split(/(\d{4}-\d{2}-\d{2}(?:.|[\r\n])+?)(?=\d{4}-\d{2}-\d{2})/)
  // Regex seems to insert a blank string between each entry, this removes them
  lines = lines.filter(function (v) {return v !== ''})
  return lines
}

module.exports = {
  getEntries
}
