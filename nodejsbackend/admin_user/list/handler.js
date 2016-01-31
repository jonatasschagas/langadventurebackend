'use strict';

/**
 * This Lambda Function returns the list of registered AdminUsers
 * @type {*|exports|module.exports}
 */

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {

    console.log('Fetching admin users: ');
    lib.list('AdminUser', 'ID,UserName,LastLogin,UserRoles', function (response) {
        console.log(response);
        if (response.success && response.data) {
            var items = response.data;
            if (!items) {
                items = [];
            }
            context.done(null, {
                'success': true,
                'message': 'Admin users were fetched successfully.',
                'data': {'items': items}
            });
        } else {
            context.done(null, {'success': false, 'message': 'Unable to fetch admin users.'});
        }
    });

};