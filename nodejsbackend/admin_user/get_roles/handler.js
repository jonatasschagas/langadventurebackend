'use strict';

/**
 * This Lambda Function returns the AdminUser roles.
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('fetching roles: ', event);

    var fbUserId = event['fbUserId'];

    if (_.isEmpty(fbUserId)) {
        utils.error(context,
            'Admin User',
            'get roles',
            'Please provide a Facebook User Id (fbUserId).', null);
        return;
    }

    console.log('Fetching roles from admin user: ' + fbUserId);
    db.get('AdminUser', fbUserId).then(function (response) {
        utils.log('db response: ', response);
        if (!_.isEmpty(response.Item)) {
            utils.success(context, 'roles', 'fetch', {'userRoles': response.Item.UserRoles});
        } else {
            utils.error(context, 'roles', 'fetch', 'Unable to find a user.', null);
        }
    }).catch(function (e) {
        utils.error(context, 'roles', 'fetch', 'Unable to find a user.', e);
    });
};
