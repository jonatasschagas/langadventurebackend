'use strict';

/**
 * This Lambda Function performs the following:
 *  - Registers the user in case it is the first time he access the tool.
 *  - Updates the "last Login time" in case he was already registered in the tool.
 *
 * @type {AWS|exports|module.exports}
 */

var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {
    // logging event
    console.log(JSON.stringify(event));

    var name = event['name'];
    var fbUserId = event['fbUserId'];
    var now = new Date();

    if (!fbUserId || !name) {
        console.log('Error registering user. Please provide a facebook User Id and a name');
        context.done(null, {
            'success': false,
            'message': 'Error registering user. Please provide a facebook User Id and a name.'
        });
        return
    }

    lib.get('AdminUser', fbUserId, function (response) {
        if (response.success && response.data) {
            console.log('Updating user: ' + name);
            lib.update('AdminUser', fbUserId, {'lastLogin': now.toDateString()}, function (success) {
                if (success) {
                    context.done(null, {'success': true, 'message': 'User registered successfully.'});
                } else {
                    context.done(null, {'success': false, 'message': 'Error registering user'});
                }
            });
        } else {
            console.log('Registering new user: ' + name);
            lib.save(
                'AdminUser',
                {
                    'Key': fbUserId,
                    'name': name,
                    'createdDate': now.toDateString()
                },
                function (success) {
                    if (success) {
                        context.done(null, {'success': true, 'message': 'User registered successfully.'});
                    } else {
                        context.done(null, {'success': false, 'message': 'Error registering user'});
                    }
                }
            );
        }
    });

};