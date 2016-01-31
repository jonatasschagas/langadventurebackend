/**
 * Lib
 */

/**
 * DynamoDB examples can be found here:
 *  - http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.03.html
 */

var AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
});
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
            'ID': key
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
            if (Object.keys(data).length > 0) {
                callback({'success': true, 'message': 'Record fetched successfully.', 'data': data});
            } else {
                callback({'success': true, 'message': 'Record fetched successfully.', 'data': null});
            }
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
            if (i > 0) {
                updateExpression += ',';
            }
            updateExpression += attributeName + ' = ' + paramPlaceHolder + ' ';
            expressionAttributeValues[paramPlaceHolder] = valuesToUpdate[attributeName];
            i++;
        }
    }

    var params = {
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

/**
 * Scans ALL the items from the DynamoDB table
 * @param tableName
 * @param fieldsToFetch
 * @param callback
 */
function list(tableName, fieldsToFetch, callback) {

    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    var query = {
        TableName: tableName,
        ProjectionExpression: fieldsToFetch
    };

    console.log('Scanning table: ' + tableName + ', fields to fetch: ' + fieldsToFetch);
    dynamoDbClient.scan(query, function (err, data) {
        if (err) {
            console.log('Error scanning table: ' + err);
            callback({'success': false, 'message': 'Unable to list table: ' + tableName});
        } else {
            console.log('Records fetched successfully..');
            callback({'success': true, 'message': 'Records fetched successfully..', 'data': data.Items});
        }
    });
}

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
    guid: guid
};