'use strict';

/**
 * This Lambda Function performs the following:
 *  - Registers the user in case it is the first time he access the tool.
 *  - Updates the "last Login time" in case he was already registered in the tool.
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils')
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('registering login/first time access: ', event);

    var userName = event['userName'];
    var fbUserId = event['fbUserId'];
    var now = new Date();

    if (_.isEmpty(fbUserId) || _.isEmpty(userName)) {
        utils.error(context, 'Admin User', 'registering', null);
        return;
    }

    if (!_.isEmpty(fbUserId)) {
        db.saveOrUpdate('AdminUser', fbUserId, {
            'LastLogin': now.toDateString(),
            'UserName': userName
        })
            .then(function () {
                db.get('AdminUser', fbUserId)
                    .then(function (getResponse) {
                        if (!_.isEmpty(getResponse.Item)
                            && !_.isEmpty(getResponse.Item.ID)) {
                            utils.success(
                                context,
                                'Admin User',
                                'updating',
                                getResponse.Item.UserRoles
                            );
                        }
                    });
            })
            .catch(function (e) {
                utils.error(
                    context,
                    'Admin User',
                    'updating',
                    'Error updating the user last access.',
                    e)
            });
    } else {
        db.saveOrUpdate('AdminUser', id, {
            'ID': fbUserId,
            'UserName': userName,
            'CreatedDate': now.toDateString(),
            'UserRoles': []
        })
            .then(utils.success(context, 'AdminUser', 'saving', {}))
            .catch(function (e) {
                utils.error(
                    context,
                    'Admin User',
                    'saving',
                    'Error saving the user.',
                    e)
            });
    }
};
