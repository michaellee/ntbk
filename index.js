#!/usr/bin/env node
var program = require('commander')
var fs = require('fs')
var co = require('co')
var prompt = require('co-prompt')
var emojic = require('emojic')

// Check if default journal exists
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var defaultConfigPath = home + '/.ntbk_config'
var fileExists = null
var defaultNotebookPath = home + '/notebook.txt'
var newConfigFile = {
  'notebooks': {
    'default': defaultNotebookPath
  }
}

var addZero = function(value){
  value = value < 10 ? '0' + value : value
  return value
}

var getTime = function(){
  var timestamp = new Date()
  var now = timestamp.getFullYear() + '-' + addZero(timestamp.getMonth() + 1) + '-' + addZero(timestamp.getDate()) + ' ' + addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes())
  return now
}

try {
  fileExists = fs.statSync(defaultConfigPath).isFile()
} catch (e) {
  fileExists = false
}

if(fileExists){
  
  var obj = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
  
  program
    .version('0.0.1')
    .arguments('<entry>')
    .parse(process.argv)

  if(!program.args.length){
    program.help()
  }else{
    var entry = program.args.join(' ')
    fs.appendFile(obj.notebooks.default, getTime() + ' ' + entry + '\n\n')
    console.log('[' + emojic.okHand + ' Entry added to notebook]')
  }
}else{
  co(function *(){
    var notebookPath = yield prompt('Path to your notebook file (leave blank for ' + home + '/notebook.txt): ')
    newConfigFile.notebooks.default = notebookPath ? notebookPath : newConfigFile.notebooks.default
    fs.closeSync(fs.openSync(defaultConfigPath, 'w'))
    fs.writeFileSync(defaultConfigPath, JSON.stringify(newConfigFile, '', 2))
    var entry = yield prompt('[Compose entry; press Ctrl+D to finish writing]\n')
    fs.writeFileSync(newConfigFile.notebooks.default, getTime() + ' ' + entry + '\n\n')
    console.log('[' + emojic.okHand + ' Entry added to notebook]')
  })
}
