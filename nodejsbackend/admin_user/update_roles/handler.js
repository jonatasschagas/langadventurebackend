'use strict';

/**
 * This Lambda Function performs the following:
 *  - Updates the roles from the given User
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {
    // logging event
    utils.log('update roles:', event)

    var roles = event['roles'];
    var fbUserId = event['fbUserId'];

    if (_.isEmpty(fbUserId) || _.isEmpty(roles)) {
        utils.error(
            context,
            'Admin User',
            'update',
            'Please provide a facebook User Id and an array of roles.',
            null
        );
        return;
    }

    utils.log('Updating user: ', fbUserId);
    db.update('AdminUser', fbUserId, {
        'UserRoles': roles
    }).then(function (response) {
        utils.success(context, 'Admin User', 'updated', null);
    }).catch(function (e) {
        utils.error(
            context,
            'Admin User',
            'updated',
            'Unable to update user\'s roles.',
            e
        );
    });
};
