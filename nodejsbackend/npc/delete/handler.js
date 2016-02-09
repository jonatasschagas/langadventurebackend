'use strict';

/**
 * This Lambda Function deletes the given Npc record based on the ID
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

  utils.log('Delete npc:', event);

  var id = event.id;
  if (_.isEmpty(id)) {
    utils.error(context, 'Npc', 'deleted', 'Please provide an id.', null);
    return;
  }

  console.log('Deleting npc id: ' + id);
  db.deleteItem('Npc', id).then(function () {
    utils.success(context, 'Npc', 'deleted', null);
  }).catch(function (e) {
    utils.success(context, 'Npc', 'deleted', null);
    utils.error(
        context,
        'Npc',
        'deleting',
        'Error deleting npc from the database.',
        e
    );
  });
};
