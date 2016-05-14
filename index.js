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
  var now = timestamp.getFullYear() + '-' + addZero(timestamp.getMonth() + 1) + '-' + addZero(timestamp.getDate()) + ' ' + addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes())
  return now
}

// If config exists, write entry into existing notebook
if (fileConfigExists) {
  var obj = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'))

  program
    .version('0.0.1')
    .arguments('<entry>')
    .parse(process.argv)

  if (!program.args.length) {
    co(function * () {
      var entry = yield prompt('[' + emojic.pencil2 + '  Start writing your entry. When you\'re done press Ctrl+C to save your entry]\n')
      fs.appendFile(obj.notebooks.default, getTime() + ' ' + entry + '\n\n')
      console.log('[' + emojic.v + '  Your entry was added to your notebook]')
    })
  } else {
    var entry = program.args.join(' ')
    fs.appendFile(obj.notebooks.default, getTime() + ' ' + entry + '\n\n')
    console.log('[' + emojic.v + '  Your entry was added to your notebook]')
  }
}
// Else the config files doesn't exist, specify where to write entries,
// then write the first entry 
else {
  co(function * () {
    var notebookPath = yield prompt('Path to your notebook file (leave blank for ' + home + '/notebook.txt): ')
    newConfigFile.notebooks.default = notebookPath ? notebookPath : newConfigFile.notebooks.default
    fs.closeSync(fs.openSync(defaultConfigPath, 'w'))
    fs.writeFileSync(defaultConfigPath, JSON.stringify(newConfigFile, '', 2))
    var entry = yield prompt('[Compose entry; press Ctrl+C to finish writing]\n')
    fs.writeFileSync(newConfigFile.notebooks.default, getTime() + ' ' + entry + '\n\n')
    console.log('[' + emojic.v + '  Your first entry was added to your notebook]')
  })
}
