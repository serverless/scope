/**
 * DynamoDB wrapper util
 */
const isEmpty = require('lodash.isempty');
const awsSDK = require('aws-sdk');
const dynamoDoc = getDynamoDoc();
const notFoundMsg = '404:Resource not found.';

function getDynamoDoc() {
  return new awsSDK.DynamoDB.DocumentClient({
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
  });
}

function put(params, cb, respondSuffix) {
  const startTime = Date.now();
  return dynamoDoc.put(params, function(err, data) {
    console.log(err, data);
    if (respondSuffix && isEmpty(data)) {
      data = respondSuffix;
    }
    const endTime = Date.now();
    console.log('DB PUT Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data);
  });
}

function get(params, cb) {
  const startTime = Date.now();
  return dynamoDoc.get(params, function(err, data) {
    console.log(err, data);
    if (err) {
      return {}; // err;
    }
    if (isEmpty(data)) {
      return cb(notFoundMsg);
    }
    const endTime = Date.now();
    console.log('DB GET Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Item);
  });
}

function query(params, cb) {
  const startTime = Date.now();
  console.log(params);
  return dynamoDoc.query(params, function(err, data) {
    console.log(err, data);
    if (isEmpty(data)) {
      return cb(notFoundMsg);
    }
    const endTime = Date.now();
    console.log('DB Query Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Items);
  });
}

function scan(params, cb) {
  const startTime = Date.now();
  return dynamoDoc.scan(params, function(err, data) {
    console.log(err, data);
    if (isEmpty(data)) {
      return cb(notFoundMsg);
    }
    const endTime = Date.now();
    console.log('DB Scan Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Items);
  });
}

function update(params, cb) {
  const startTime = Date.now();
  return dynamoDoc.update(params, function(err, data) {
    console.log(err, data);
    if (isEmpty(data)) {
      return cb(notFoundMsg);
    }
    const endTime = Date.now();
    console.log('DB UPDATE Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Attributes);
  });
}

function del(params, cb) {
  const startTime = Date.now();
  return dynamoDoc.delete(params, function(err, data) {
    console.log(err, data);
    if (isEmpty(data)) {
      return cb(notFoundMsg);
    }
    const endTime = Date.now();
    console.log('DB DEL Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Attributes);
  });
}

function batchGet(params, cb, table) {
  const startTime = Date.now();
  return dynamoDoc.batchGet(params, function(err, data) {
    const endTime = Date.now();
    console.log('DB batchGet Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, data.Responses[table]);
  });
}

function batchWrite(params, cb, responseValue) {
  const startTime = Date.now();
  return dynamoDoc.batchWrite(params, function(err, data) {
    const endTime = Date.now();
    console.log('DB batchWrite Elapsed time: ' + String(endTime - startTime) + ' milliseconds');
    return cb(err, responseValue);
  });
}

const db = {
  put: put,
  get: get,
  query: query,
  scan: scan,
  update: update,
  del: del,
  batchGet: batchGet,
  batchWrite: batchWrite
};

module.exports = db;
