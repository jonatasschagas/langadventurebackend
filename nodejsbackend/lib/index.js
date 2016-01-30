/**
 * Lib
 */

/**
 * DynamoDB examples can be found here:
 *  - http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.03.html
 */

var AWS = require('aws-sdk');

/**
 * Saves the item to DynamoDB
 * @param tableName
 * @param valuesToSave
 * @param callback
 */
function save(tableName, valuesToSave, callback) {

    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    var insertRecord = {
        TableName: tableName,
        Item: valuesToSave
    };

    console.log('saving to table: ' + tableName + ', item: ' + JSON.stringify(valuesToSave));
    dynamoDbClient.put(insertRecord, function (err, data) {
        if (err) {
            console.log('Error saving record: ' + err);
            callback(false);
        } else {
            console.log('Record saved successfully.');
            callback(true);
        }
    });
}

/**
 * Fetches from the given DynamoDB Table the record. The key must be a string.
 * @param tableName
 * @param key
 * @param callback
 */
function get(tableName, key, callback) {

    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        Key: {
            'Key': key
        },
        TableName: tableName
    };

    console.log('Fetching Item: ' + key + ', from table: ' + tableName + '.');
    dynamoDbClient.get(params, function (err, data) {
        if (err) {
            console.log('Error fetching record: ' + err + '. Response: ' + data);
            callback({'success': false, 'message': 'Error fetching item from table: ' + tableName});
        } else {
            console.log('Record fetched successfully.');
            callback({'success': true, 'message': 'Record fetched successfully.', 'data': data});
        }
    });
}

/**
 * Updates the item in DynamoDB. The Key must be a string.
 * @param tableName
 * @param key
 * @param valuesToUpdate
 * @param callback
 */
function update(tableName, key, valuesToUpdate, callback) {

    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    var updateExpression = 'set ';
    var expressionAttributeValues = {};
    var i = 0;
    for (var attributeName in valuesToUpdate) {
        if (valuesToUpdate.hasOwnProperty(attributeName)) {
            var paramPlaceHolder = ':' + String.fromCharCode(97 + i);
            updateExpression += attributeName + ' = ' + paramPlaceHolder + ' ';
            expressionAttributeValues[paramPlaceHolder] = valuesToUpdate[attributeName];
        }
    }

    var params = {
        Key: {
            'Key': key
        },
        TableName: tableName,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    console.log('Updating the record from table: ' + tableName
        + '. Update Exp: ' + updateExpression
        + ', Expression Value Attr: ' + JSON.stringify(expressionAttributeValues));
    dynamoDbClient.update(params, function (err, data) {
        if (err) {
            console.log('Unable to update record: ' + err);
            callback(false);
        } else {
            console.log('Record updated successfully.');
            callback(true);
        }
    });
}

module.exports = {
    save: save,
    get: get,
    update: update
};