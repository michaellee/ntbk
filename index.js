#!/usr/bin/env node
var program = require('commander')

program
  .version('0.0.1')
  .arguments('<entry>')
  .parse(process.argv)

if(!program.args.length){
  program.help()
}else{
  console.log(program.args.join(' '))  
}
