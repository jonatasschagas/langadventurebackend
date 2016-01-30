'use strict';

/**
 * This Lambda Function returns the AdminUser roles.
 * @type {*|exports|module.exports}
 */

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {

    var fbUserId = event['fbUserId'];

    if (!fbUserId) {
        console.log('Error fetching admin user roles. Please provide a Facebook User Id (fbUserId).');
        context.done(null, {
            'success': false,
            'message': 'Error fetching admin user roles. Please provide a Facebook User Id (fbUserId).'
        });
        return
    }

    console.log('Fetching roles from admin user: ' + fbUserId);
    lib.get('AdminUser', fbUserId, function (response) {
        if (response.success && response.data) {
            var roles = response.data.Item.roles;
            if(!roles) {
                roles = [];
            }
            context.done(null, {
                'success': true,
                'message': 'Roles were fetched successfully.',
                'data': {'roles': roles}
            });
        } else {
            context.done(null, {'success': false, 'message': 'Unable to fetch admin user roles.'});
        }
    });

};