#!/usr/bin/env node
var program = require('commander')
var fs = require('fs')
var co = require('co')
var prompt = require('co-prompt')
var emojic = require('emojic')

// Get user's home directory
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
var defaultConfigPath = home + '/.ntbk_config'
var fileConfigExists = null
var defaultNotebookPath = home + '/notebook.txt'
var newConfigFile = {
  'notebooks': {
    'default': defaultNotebookPath
  }
}

try {
  fileConfigExists = fs.statSync(defaultConfigPath).isFile()
} catch (e) {
  fileConfigExists = false
}

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
 * Returns current date and time in format of YYYY-MM-DD HH:MM
 * @return {String} now
 */
var getTime = function () {
  var timestamp = new Date()
  var now = timestamp.getFullYear() + '-' + addZero((timestamp.getMonth() + 1)) + '-' + addZero(timestamp.getDate()) + ' ' + addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes())
  return now
}

var isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * Returns all entries as an array
 * @return {Array} lines
 */
var getEntries = function () {
  var entries = fs.readFileSync(obj.notebooks.default, 'utf8')
  // Regex to split the string by entries into an array
  var lines = entries.split(/(\d{4}-\d{2}-\d{2}(?:.|[\r\n])+?)(?=\d{4}-\d{2}-\d{2})/)
  // Regex seems to insert a blank string between each entry, this removes them
  lines = lines.filter(function (v) {return v !== ''})
  return lines
}

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var pluralizeUnit = function (value, unit) {
  return value > 1 ? unit + 's' : unit
}

// If config exists, write entry into existing notebook
if (fileConfigExists) {
  var obj = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'))

  program
    .version('v0.3.1')
    .option('-l, --list [n]', 'List entries', parseInt)
    .option('-m, --memories [unit]', 'View entry from past')
    .option('-t, --tag <tag>', 'List entries that contain tag')
    .arguments('<entry>')
    .parse(process.argv)

  if (program.list) {
    var entries = getEntries()
    // If the list option is passed a number, get the last number of entries 
    // starting from the passed number, else list all entries
    if (isNumber(program.list)) {
      // Determines the starting point from which to get all entries
      var start = entries.length - program.list
      var requestedEntries = []
      for (var i = start; i <= entries.length; i++) {
        requestedEntries.push(entries[i])
      }
      // Combine all entries back into a string
      entries = requestedEntries.join('')
    } else {
      entries = entries.join('')
    }
    console.log(entries)
    process.exit()
  }

  if (program.memories) {
    var entries = getEntries()
    var dateQuery = new Date
    var year = dateQuery.getFullYear()
    var month = dateQuery.getMonth() + 1
    var date = dateQuery.getDate()
    var requestedEntries = []
    var query = ['1', 'y']
    var units = {
      'd': 'day',
      'm': 'month',
      'y': 'year'
    }
    if (typeof program.memories != 'boolean') {
      query = program.memories.match(/[a-zA-Z]+|[0-9]+/g)
      if (query[1] == 'd') {
        date -= query[0]
      }else if (query[1] == 'm') {
        month -= query[0]
      }else if (query[1] == 'y') {
        year -= query[0]
      } else {
        console.log('[' + emojic.thinking + "  Hey that's not a recognized unit, use either 'd - day', 'm - month', 'y - year']")
        process.exit()
      }
    }
    dateQuery = year + '-' + addZero(month) + '-' + addZero(date)
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].indexOf(dateQuery) > -1) {
        requestedEntries.push(entries[i])
      }
    }
    if (requestedEntries.length == 0) {
      console.log('[' + emojic.tada + "  It looks like you don't have any memories from " + query[0] + ' ' + pluralizeUnit(query[0], units[query[1]]) + " ago...so here's a random one]")
      entries = entries[getRandomInt(0, entries.length - 1)]
    } else {
      entries = requestedEntries.join('')
    }
    console.log(entries)
    process.exit()
  }

  if (program.tag) {
    var entries = getEntries()
    var requestedEntries = []
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].indexOf('#' + program.tag) > -1) {
        requestedEntries.push(entries[i])
      }
    }
    entries = requestedEntries.join('')
    console.log(entries)
    process.exit()
  }

  if (!program.args.length) {
    co(function * () {
      var entry = yield prompt('[' + emojic.pencil2 + "  Start writing your entry. When you're done press return to save your entry]\n")
      fs.appendFileSync(obj.notebooks.default, getTime() + ' ' + entry + '\n\n')
      console.log('[' + emojic.v + '  Your entry was added to your notebook]')
      process.exit()
    })
  } else {
    var entry = program.args.join(' ')
    fs.appendFileSync(obj.notebooks.default, getTime() + ' ' + entry + '\n\n')
    console.log('[' + emojic.v + '  Your entry was added to your notebook]')
  }
}
// Else the config files doesn't exist, specify where to write entries,
// then write the first entry 
else {
  co(function * () {
    var notebookPath = yield prompt(emojic.greenBook + '  Where would you like to store your notebook? (leave blank for ' + home + '/notebook.txt): ')
    newConfigFile.notebooks.default = notebookPath ? notebookPath : newConfigFile.notebooks.default
    fs.closeSync(fs.openSync(defaultConfigPath, 'w'))
    fs.writeFileSync(defaultConfigPath, JSON.stringify(newConfigFile, '', 2))
    var entry = yield prompt('[' + emojic.pencil2 + "  Start writing your entry. When you're done press return to save your entry]\n")
    // Check to see if the file already exists
    fs.stat(newConfigFile.notebooks.default, function (err) {
      if (!err) {
        fs.appendFileSync(newConfigFile.notebooks.default, getTime() + ' ' + entry + '\n\n')
        console.log('[' + emojic.v + '  Your entry was added to your notebook]')
      } else {
        fs.writeFileSync(newConfigFile.notebooks.default, getTime() + ' ' + entry + '\n\n')
        console.log('[' + emojic.v + '  Your first entry was added to your notebook]')
      }
      process.exit()
    })
  })
}

// Handle exits with CTRL+C
process.on('SIGINT', function () {
  console.log('\n[' + emojic.sob + '  Nothing was added to your notebook]')
  process.exit()
})
