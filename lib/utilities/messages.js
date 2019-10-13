const emojic = require('emojic')

/**
 * Console logs the success message 
 */
const success = () => {
  console.log(`[${emojic.v}  Your entry was added to your notebook]`)
}

module.exports = {
  success
}

