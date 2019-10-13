const emojic = require('emojic')

/**
 * Console logs the success message 
 */
const successMessage = () => {
  console.log(`[${emojic.v}  Your entry was added to your notebook]`)
}

const entryCountMessage = (count, entries) => {
  console.log('[' + emojic.star2 + '  You\'ve got ' + count + ' ' + entries + ' in your notebook. Keep on writing!]')
}

module.exports = {
  successMessage,
  entryCountMessage
}

