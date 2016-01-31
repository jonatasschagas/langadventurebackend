'use strict';

/**
 * This Lambda Function performs the following:
 *  - Updates the roles from the given User
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

    var roles = event['roles'];
    var fbUserId = event['fbUserId'];

    if (!fbUserId || !roles) {
        console.log('Error updating user\'s roles. Please provide a facebook User Id and an array of roles.');
        context.done(null, {
            'success': false,
            'message': 'Error updating user\'s roles. Please provide a facebook User Id and an array of roles.'
        });
        return
    }

    console.log('Updating user: ' + fbUserId);
    lib.update('AdminUser', fbUserId, {
        'UserRoles': roles
    }, function (success) {
        if (success) {
            context.done(null, {
                'success': true,
                'message': 'User\'s roles updated successfully.'
            });
        } else {
            context.done(null, {'success': false, 'message': 'Error updating user\'s roles.'});
        }
    });

};