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
    
    var alias = event['query_params']['alias'];

    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    
    if(!alias) {
        console.log('Error querying client version. Please provide and alias');
        context.done(null, {'success': false, 'message': 'Error querying client version. Please provide an alias.'});
        return
    }
    
    var query = {
        TableName: 'ClientVersion',
        KeyConditionExpression: "#alias = :aliasValue",
        ExpressionAttributeNames:{
            "#alias": "alias"
        },
        ExpressionAttributeValues: {
            ":aliasValue":alias
        }
    };
    
    console.log('Querying client version: '  + alias );
    dynamoDbClient.query(query, function(err, data) {
        if (err) {
            console.log('Error querying client version: ' + err);
            context.done(null, {'success': false, 'message': 'Error querying client version: ' + alias});
        } else {
            console.log('Client version created successfully.');
            context.done(null,{'success': true, 'message': 'Client version fetched successfully.', 'data': data});
        }
    });
    
};