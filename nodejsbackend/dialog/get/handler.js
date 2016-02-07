'use strict';

/**
 * This Lambda Function returns the Dialog based on the provided ID
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

  utils.log('fetching dialog: ', event);

  var id = event.dialogId;

  if (_.isEmpty(id)) {
    utils.error(context,
        'Dialog',
        'fetch',
        'Please provide a dialog id(dialogId).', null);
    return;
  }

  console.log('Fetching dialog: ' + id);
  db.get('Dialog', id).then(function (response) {
    utils.log('db response: ', response);
    if (!_.isEmpty(response.Item)) {
      utils.success(context, 'Dialog', 'fetch', response);
    } else {
      utils.error(context, 'Dialog', 'fetch', 'Unable to find the dialog.', null);
    }
  }).catch(function (e) {
    utils.error(context, 'Dialog', 'fetch', 'Unable to find the dialog.', e);
  });
};
