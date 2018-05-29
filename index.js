#!/usr/bin/env node
var program = require('commander')
var fs = require('fs')
var co = require('co')
var prompt = require('co-prompt')
var emojic = require('emojic')

var numbersUtilities = require('./lib/utilities/numbers')
var stringUtilities = require('./lib/utilities/string')
var timeUtilities = require('./lib/utilities/time')
var entriesUtilities = require('./lib/utilities/entries')

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

// If config exists, write entry into existing notebook
if (fileConfigExists) {
  var obj = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'))

  program
    .version('v0.5.3')
    .option('-l, --list [n]', 'List entries', parseInt)
    .option('-m, --moments [value_unit]', 'Relive moments from the past')
    .option('-t, --tag [tag]', 'List entries that contain tag')
    .option('-c, --count [emojify]', 'Entries count')
    .arguments('<entry>')
    .parse(process.argv)

  if (program.list) {
    var entries = entriesUtilities.getEntries(obj)
    // If the list option is passed a number, get the last number of entries
    // starting from the passed number, else list all entries
    if (numbersUtilities.isNumber(program.list)) {
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

  if (program.moments) {
    var entries = entriesUtilities.getEntries(obj)
    var dateQuery = new Date()
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
    if (typeof program.moments != 'boolean') {
      query = program.moments.match(/[a-zA-Z]+|[0-9]+/g)
      if (query[1] == 'd') {
        date -= query[0]
      }else if (query[1] == 'm') {
        month -= query[0]
      }else if (query[1] == 'y') {
        year -= query[0]
      } else {
        if (query.length == 1 && query[0].length <= 2 && typeof query[0] == 'string') {
          console.log('[' + emojic.thinking + "  It looks like you forgot a value with your unit, try something like '2m']")
          process.exit()
        }
        console.log('[' + emojic.thinking + "  Hey that's not a recognized unit, use either 'd - day', 'm - month', 'y - year']")
        process.exit()
      }
    } else {
      year -= query[0]
    }
    dateQuery = year + '-' + stringUtilities.addZero(month) + '-' + stringUtilities.addZero(date)
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].indexOf(dateQuery) > -1) {
        requestedEntries.push(entries[i])
      }
    }
    if (requestedEntries.length == 0) {
      console.log('[' + emojic.tada + "  It looks like you don't have any moments from " + query[0] + ' ' + stringUtilities.pluralizeUnit(query[0], units[query[1]]) + " ago...so here's a random one]")
      entries = entries[numbersUtilities.getRandomInt(0, entries.length - 1)]
    } else {
      entries = requestedEntries.join('')
    }
    console.log(entries)
    process.exit()
  }

  if (program.tag) {
    var entries = entriesUtilities.getEntries(obj)

    if (program.tag !== true) {
      var requestedEntries = []
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].indexOf('#' + program.tag) > -1) {
          requestedEntries.push(entries[i])
        }
      }
      entries = requestedEntries.join('')
      console.log(entries)
      process.exit()
    } else {
      var tags = {}
      var longestLength = 0
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].indexOf('#') > -1) {
          var tag = entries[i].match(/#([a-zA-Z]*)/g)
          tag = tag[0]
          longestLength = tag.length > longestLength ? tag.length : longestLength
          if (tags.hasOwnProperty(tag)){
            tags[tag] += 1
          } else {
            tags[tag] = 1
          }
        }
      }

      if (Object.keys(tags).length === 0 && tags.constructor === Object) {
        console.log('[' + emojic.cry + '  It looks like you aren\'t using any tags in your notebook.]')
        process.exit()
      }

      console.log('[' + emojic.label + '  Here is a list of all the tags you\'ve used in your notebook.]')

      /**
       * Adds correct spacing after tag
       * @param {String} tag
       * @return {String} tag with spacing to the right of the tag
       */
      var spacedTag = function (tag) {
        var spacing = longestLength >= tag.length ? longestLength - tag.length : longestLength
        return tag + new Array(spacing + 2).join(' ')
      }

      for (var i in tags) {
        console.log(spacedTag(i) + '[' + tags[i] + ']')
      }
      process.exit()
    }
  }

  if (program.count) {
    var count = entriesUtilities.getEntries(obj).length
    if (program.count === 'emojify') {
      count = numbersUtilities.emojifyNumber(entriesUtilities.getEntries(obj).length) + ' '
    }
    var entries = entriesUtilities.getEntries(obj).length > 1 || entriesUtilities.getEntries(obj).length === 0 ? 'entries' : 'entry'
    console.log('[' + emojic.star2 + '  You\'ve got ' + count + ' ' + entries + ' in your notebook. Keep on writing!]')
    process.exit()
  }

  if (!program.args.length) {
    co(function * () {
      var entry = yield prompt('[' + emojic.pencil2 + "  Start writing your entry. When you're done press return to save your entry]\n")
      fs.appendFileSync(obj.notebooks.default, timeUtilities.getTime() + ' ' + entry + '\n\n')
      console.log('[' + emojic.v + '  Your entry was added to your notebook]')
      process.exit()
    })
  } else {
    var entry = program.args.join(' ')
    fs.appendFileSync(obj.notebooks.default, timeUtilities.getTime() + ' ' + entry + '\n\n')
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
        fs.appendFileSync(newConfigFile.notebooks.default, timeUtilities.getTime() + ' ' + entry + '\n\n')
        console.log('[' + emojic.v + '  Your entry was added to your notebook]')
      } else {
        fs.writeFileSync(newConfigFile.notebooks.default, timeUtilities.getTime() + ' ' + entry + '\n\n')
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
