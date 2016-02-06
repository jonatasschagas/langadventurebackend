'use strict';
/**
 * dynamo-db-utils: Encapsulates all the functions related to
 * DynamoDB.
 */

/**
 * DynamoDB examples can be found here:
 *  - http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.03.html
 */

var _ = require('lodash-node');
var Promise = require("bluebird");
var AWS = require('aws-sdk');
var utils = require('./utils');
AWS.config.update({
    region: "us-east-1"
});

/**
 * Creates the connection to DynamoDB and promisifies the connection object.
 * @returns {*}
 */
function getDynamoDbClient() {
    return Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());
}

/**
 * Saves the item to DynamoDB
 * @param tableName
 * @param valuesToSave
 */
function save(tableName, valuesToSave) {
    var dynamoDbClient = getDynamoDbClient(), insertRecord = {
        TableName: tableName,
        Item: valuesToSave
    };
    console.log('saving to table: ' + tableName + ', item: ' + JSON.stringify(valuesToSave));
    return dynamoDbClient.putAsync(insertRecord);
}

/**
 * Fetches from the given DynamoDB Table the record. The key must be a string.
 * @param tableName
 * @param key
 */
function get(tableName, key) {
    var dynamoDbClient = getDynamoDbClient(), params = {
        Key: {
            'ID': key
        },
        TableName: tableName
    };
    console.log('Fetching Item: ' + key + ', from table: ' + tableName + '.');
    return dynamoDbClient.getAsync(params);
}

/**
 * Updates the item in DynamoDB. The Key must be a string.
 * @param tableName
 * @param key
 * @param valuesToUpdate
 */
function update(tableName, key, valuesToUpdate) {

    var dynamoDbClient = getDynamoDbClient(), updateExpression = 'set ',
        expressionAttributeValues = {}, i = 0,
        attributeName, paramPlaceHolder, params;

    for (attributeName in valuesToUpdate) {
        if (valuesToUpdate.hasOwnProperty(attributeName)) {
            paramPlaceHolder = ':' + String.fromCharCode(97 + i);
            if (i > 0) {
                updateExpression += ',';
            }
            updateExpression += attributeName + ' = ' + paramPlaceHolder + ' ';
            expressionAttributeValues[paramPlaceHolder] = valuesToUpdate[attributeName];
            i = i + 1;
        }
    }
    params = {
        Key: {
            'ID': key
        },
        TableName: tableName,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };
    console.log('Updating the record from table: ' + tableName
        + '. Update Exp: ' + updateExpression
        + ', Expression Value Attr: ' + JSON.stringify(expressionAttributeValues));
    return dynamoDbClient.updateAsync(params);
}

/**
 * Scans ALL the items from the DynamoDB table
 * @param tableName
 * @param fieldsToFetch
 */
function list(tableName, fieldsToFetch) {
    var dynamoDbClient = getDynamoDbClient(), query = {
        TableName: tableName,
        ProjectionExpression: fieldsToFetch
    };
    console.log('Scanning table: ' + tableName + ', fields to fetch: ' + fieldsToFetch);
    return dynamoDbClient.scanAsync(query);
}

/**
 * Deletes the item from DynamoDB
 * @param tableName
 * @param key
 * @returns {*}
 */
function deleteItem(tableName, key) {
    var dynamoDbClient = getDynamoDbClient(), deleteQuery = {
        TableName: tableName,
        Key: {
            'ID': key
        }
    };
    console.log('Deleting record ' + key + ' from table: ' + tableName);
    return dynamoDbClient.deleteAsync(deleteQuery);
}

/**
 * Saves or updates the items in DynamoDB. Returns a promise.
 * @param tableName
 * @param id
 * @param fields
 */
function saveOrUpdate(tableName, id, fields) {
    if (!_.isEmpty(id)) {
        get(tableName, id).then(function (getResponse) {
            utils.log('get response: ', getResponse);
            if (!_.isEmpty(getResponse.Item) && !_.isEmpty(getResponse.Item.ID)) {
                utils.log('updating record: ', fields);
                update(tableName, id, fields).then(function (updateResponse) {
                    utils.log('response from DB: ', updateResponse);
                    return Promise.resolve(getResponse);
                }).catch(function (e) {
                    return Promise
                        .reject(new Error('Error registering access to the database.', e));
                });
            } else {
                return save(tableName, fields);
            }
        });
    } else {
        return save(tableName, fields);
    }
}

/**
 * Generates a random UUID
 * @returns {string}
 */
function guid() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

module.exports = {
    save: save,
    get: get,
    update: update,
    list: list,
    deleteItem: deleteItem,
    saveOrUpdate: saveOrUpdate,
    guid: guid
};
