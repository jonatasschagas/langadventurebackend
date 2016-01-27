'use strict';

var ServerlessHelpers = require('serverless-helpers-js').loadEnv();
var AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
});

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function(event, context) {
    
    // logging event
    console.log(JSON.stringify(event));
    
    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    
    var query = {
        TableName: 'ClientVersion'
    };
    
    dynamoDbClient.scan(query, function(err, data) {
        if (err) {
            console.log('Error listing client version: ' + err);
            context.done(null, {'success': false, 'message': 'Error listing client version'});
        } else {
            console.log('Client versions listed successfully.');
            context.done(null,{'success': true, 'message': 'Client version listed successfully.', 'data': data});
        }
    });
    
};