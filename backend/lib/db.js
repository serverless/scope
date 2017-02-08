/**
 * DynamoDB wrapper util
 */
const isEmpty = require('lodash.isempty')
const awsSDK = require('aws-sdk')
const dynamoDoc = new awsSDK.DynamoDB.DocumentClient()
const notFoundMsg = '404:Resource not found.'
const DEBUG = false

function put(params, callback, respondSuffix) {
  const startTime = Date.now()
  return dynamoDoc.put(params, function(err, data) {
    if (err) {
      console.log('DB PUT Error', err)
      return callback(err)
    }
    if (respondSuffix && isEmpty(data)) {
      data = respondSuffix
    }
    const endTime = Date.now()
    if (DEBUG) {
      console.log('DB PUT response', data)
      console.log('DB PUT Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data)
  })
}

function get(params, callback) {
  const startTime = Date.now()
  return dynamoDoc.get(params, function(err, data) {
    if (err) {
      console.log('DB GET Error', err)
      return {} // err
    }

    if (isEmpty(data)) {
      return callback(notFoundMsg)
    }
    const endTime = Date.now()
    if (DEBUG) {
      console.log('DB GET response', data)
      console.log('DB GET Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data.Item)
  })
}

function query(params, callback) {
  const startTime = Date.now()
  if (DEBUG) console.log('query params:', params)
  return dynamoDoc.query(params, function(err, data) {
    if (err) {
      console.log('DB Query Error', err)
    }
    if (isEmpty(data)) {
      return callback(notFoundMsg)
    }
    console.log('DB Query response', data)
    const endTime = Date.now()
    console.log('DB Query Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    return callback(err, data.Items)
  })
}

function scan(params, callback) {
  const startTime = Date.now()
  return dynamoDoc.scan(params, function(err, data) {
    if (err) {
      console.log('DB Scan Error', err)
    }
    if (isEmpty(data)) {
      return callback(notFoundMsg)
    }
    if (DEBUG) {
      console.log('DB Scan response', data)
      const endTime = Date.now()
      console.log('DB Scan Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data.Items)
  })
}

function update(params, callback) {
  const startTime = Date.now()
  return dynamoDoc.update(params, function(err, data) {
    if (err) {
      console.log('DB update Error', err)
    }
    if (isEmpty(data)) {
      return callback(notFoundMsg)
    }
    if (DEBUG) {
      console.log('DB update response', data)
      const endTime = Date.now()
      console.log('DB UPDATE Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data.Attributes)
  })
}

function del(params, callback) {
  const startTime = Date.now()
  if (DEBUG) {
    console.log('delete params:', params)
  }
  return dynamoDoc.delete(params, function(err, data) {
    if (err) {
      console.log('DB delete Error', err)
      return callback(err)
    }
    if (isEmpty(data)) {
      return callback(null, data)
    }
    const endTime = Date.now()
    if (DEBUG) {
      console.log('DB delete response', data)
      console.log('DB DEL Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data.Attributes)
  })
}

function batchGet(params, callback, table) {
  const startTime = Date.now()
  return dynamoDoc.batchGet(params, function(err, data) {
    if (DEBUG) {
      const endTime = Date.now()
      console.log('DB batchWrite Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, data.Responses[table])
  })
}

function batchWrite(params, callback, responseValue) {
  const startTime = Date.now()
  return dynamoDoc.batchWrite(params, function(err, data) {
    if (DEBUG) {
      const endTime = Date.now()
      console.log('DB batchWrite Elapsed time: ' + String(endTime - startTime) + ' milliseconds')
    }
    return callback(err, responseValue)
  })
}

const db = {
  put: put,
  get: get,
  query: query,
  scan: scan,
  update: update,
  delete: del,
  batchGet: batchGet,
  batchWrite: batchWrite
}

module.exports = db
