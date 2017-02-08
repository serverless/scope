/**
 * Prep html with the correct mountNode from config
 */
var fs = require('fs')
var path = require('path')
var cheerio = require('cheerio')
var config = require('../src/default.config')()
var indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html')
const indexHtml = fs.readFileSync(indexHtmlPath).toString()
var $ = cheerio.load(indexHtml)

// Set mountNode to config.mountNodeID
$('div').attr('id', config.mountNodeID)

// write mountNode back to HTML
fs.writeFileSync(indexHtmlPath, $.html(), 'utf-8', (error) => {
  if (error) {
    return console.log(error)
  }
  console.log(`${indexHtmlPath} updated`)
})
