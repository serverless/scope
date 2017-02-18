var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var chalk = require('chalk')
var scriptLoaderUtil = require('script-loader-util')
var buildPath = path.join(__dirname, '../build')
var assets = require('../build/asset-manifest.json')
var config = require('../src/default.config')()

var file = path.join(buildPath, assets['main.js'])
console.log(chalk.blue('Re-deploying file'), file)

const appName = 'status-board'
const bucketName = config.bucketName || `assets.site.serverless.com`
const bucketPath = config.bucketPath || `apps/${appName}`
const fullBucketPath = `${bucketName}/${formatBucketPath(bucketPath)}`
// Read in the file, convert it to base64, store to S3
fs.readFile(file, function (err, data) {
  if (err) { throw err; }

  var base64data = new Buffer(data, 'binary');

  var s3 = new AWS.S3({params: {
    Bucket: bucketName
  }});

  var params = {
    Bucket: fullBucketPath,
    Key: path.basename(file),
    CacheControl: 'public, max-age=31536000', // cache loader for 1 year
    Body: base64data,
    ACL: 'public-read'
  }

  s3.upload(params, function(err, data) {
    if (err) {
      console.log(err)
    }
    const reDeployUrl = chalk.yellow(`${data.Location}`)
    console.log(' ')
    console.log(chalk.green(`Success! Main script re-deployed`))
    console.log(reDeployUrl)
    const url = decodeURIComponent(data.Location)
    // build loader
    var scriptName = `${appName}-script`
    var loaderScript = scriptLoaderUtil(scriptName, url)
    var loaderBase64data = new Buffer(loaderScript, 'binary');
    var loaderParams = {
      Bucket: fullBucketPath,
      Key: `${appName}-loader.js`,
      Body: loaderBase64data,
      ACL: 'public-read'
    }
    // upload loader with no cache
    s3.upload(loaderParams, function(err, data) {
      if (err) {
        console.log(err)
      }
      const loaderUrl = decodeURIComponent(data.Location)
      const lurl = chalk.yellow(loaderUrl)
      const scriptToInclude = chalk.yellow(`<script src="${loaderUrl}"
type="text/javascript"></script>`)
      const mountNodeToAdd = chalk.yellow(`<div id="${config.mountNodeID}"></div>`)
      console.log(' ')
      console.log(`${chalk.green('Success! Loader script rebuilt and re-deployed!')}
${lurl}

↓ Include the loader script in your site before the closing ${chalk.green('</body>')} tag ↓

${scriptToInclude}

Add the mount node to the page:

${mountNodeToAdd}

Thanks for using the status board! ⊂◉‿◉つ Tweet @DavidWells if you need any help
`)
    });

  });

});

function formatBucketPath(path){
  return path.replace(/^\//, '').replace(/\/$/, '')
}
