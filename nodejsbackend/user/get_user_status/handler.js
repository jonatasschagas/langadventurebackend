'use strict';

/**
 * This Lambda Function returns the current user' status based on the provided ID
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

  utils.log('fetching user: ', event);

  var id = event.deviceId;

  if (_.isEmpty(id)) {
    utils.error(context,
        'User',
        'fetch',
        'Please provide a user id(deviceId).', null);
    return;
  }

  console.log('Fetching user: ' + id);
  db.get('User', id).then(function (response) {
    utils.log('db response: ', response);
    if (!_.isEmpty(response.Item)) {
      utils.success(context, 'User', 'fetch', response);
    } else {
      utils.success(context, 'User', 'fetch', {'ID': id, 'CurrentQuestStep': 0});
    }
  }).catch(function (e) {
    utils.error(context, 'User', 'fetch', 'Unable to find the user.', e);
  });
};
