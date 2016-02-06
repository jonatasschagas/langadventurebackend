'use strict';

/**
 * This Lambda Function returns the list of registered AdminUsers
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('Fetching admin users: ', event);

    db.list('AdminUser', 'ID,UserName,LastLogin,UserRoles').then(function (response) {
        utils.log('db response: ', response);
        if (!_.isEmpty(response.Items)) {
            utils.success(context, 'Admin User', 'fetch', {'items': response.Items});
        } else {
            utils.error(context,
                'Admin User',
                'fetch',
                'Unable to find admin user.',
                null);
        }
    }).catch(function (e) {
        utils.error(context,
            'Admin User',
            'fetch',
            'Unable to find admin user.',
            e);
    });

};
