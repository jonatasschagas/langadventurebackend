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
    
    var alias = event['body']['alias'];
    var active = event['body']['active'];
    var createdDate = new Date();
    
    var dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    
    if(!alias) {
        console.log('Error creating client version. Please provide and alias');
        context.done(null, {'success': false, 'message': 'Error creating client version. Please provide an alias.'});
        return
    }
    
    var insertRecord = {
        TableName: 'ClientVersion',
        Item: {
            'alias': alias,
            'active': active,
            'createdDate': createdDate.toDateString()
        }
    };
    
    console.log('Creating new client version: '  + alias );
    dynamoDbClient.put(insertRecord, function(err, data) {
        if (err) {
            console.log('Error creating client version: ' + err);
            context.done(null, {'success': false, 'message': 'Error creating client version'});
        } else {
            console.log('Client version created successfully.');
            context.done(null,{'success': true, 'message': 'Client version registered successfully.'});
        }
    });
    
};