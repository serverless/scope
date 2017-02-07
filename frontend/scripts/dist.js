var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var scriptLoaderUtil = require('script-loader-util')
var buildPath = path.join(__dirname, '../build')
var assets = require('../build/asset-manifest.json')
var argv = require('yargs').argv

console.log('argv', argv.bucket)
console.log('path', argv.path)

// Build assets generated from webpack
/*
console.log('assets', assets)
/**/

var file = path.join(buildPath, assets['main.js'])
console.log('redeploying file', file)

const appName = 'status-board'
const bucketName = argv.bucket || `assets.site.serverless.com`
const bucketPath = argv.path || `apps/${appName}`
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
    console.log('App re-deployed', data.Location)
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
      console.log('Script rebuilt and ready', loaderUrl)
    });

  });

});

function formatBucketPath(path){
  return path.replace(/^\//, '').replace(/\/$/, '')
}
