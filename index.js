#!/usr/bin/env node
var program = require('commander')
var fs = require('fs')
var co = require('co')
var prompt = require('co-prompt')
var emojic = require('emojic')

const readline = require('readline')

const { getRandomInt,
        isNumber,
        emojifyNumber } = require('./lib/utilities/numbers')
var stringUtilities = require('./lib/utilities/string')
var timeUtilities = require('./lib/utilities/time')
const { getEntries } = require('./lib/utilities/entries')

const { 
  successMessage,
  entryCountMessage } = require('./lib/utilities/messages')

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
    let entries = getEntries(obj)
    // If the list option is passed a number, get the last number of entries
    // starting from the passed number, else list all entries
    if (isNumber(program.list)) {
      // Determines the starting point from which to get all entries
      const start = entries.length - program.list
      let requestedEntries = []
      for (let i = start; i <= entries.length; i++) {
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
    var entries = getEntries(obj)
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
      entries = entries[getRandomInt(0, entries.length - 1)]
    } else {
      entries = requestedEntries.join('')
    }
    console.log(entries)
    process.exit()
  }

  if (program.tag) {
    var entries = getEntries(obj)

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
    let count = getEntries(obj).length
    if (program.count === 'emojify') {
      count = `${emojifyNumber(count)} `
    }
    let entries = getEntries(obj).length > 1 || getEntries(obj).length === 0 ? 'entries' : 'entry'
    entryCountMessage(count, entries)
    process.exit()
  }

  if (!program.args.length) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    let entry = []

    rl.question(`[${emojic.pencil2} Start writing your entry. When you're done, press CTRL + C to save your entry]\n`, (input) => {
      entry.push(input)
    })

    rl.on('line', (input) => {
      entry.push(input)
    });

    rl.on('SIGINT', () => {
      entry = entry.join('\n')
      fs.appendFileSync(obj.notebooks.default, timeUtilities.getTime() + ' \n' + entry + '\n\n')
      successMessage()
      rl.pause()
      process.exit()
    })
  } else {
    var entry = program.args.join(' ')
    fs.appendFileSync(obj.notebooks.default, timeUtilities.getTime() + ' ' + entry + '\n\n')
    successMessage()
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
        successMessage()
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
