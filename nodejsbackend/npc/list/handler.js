'use strict';

/**
 * This Lambda Function returns the list of registered npcs
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {
  utils.log('Fetching npcs: ', event);
  db.list('Npc',
      'ID,' +
      'NpcNames,' +
      'Description,' +
      'CreatedDate')
      .then(function (response) {
        utils.log('Listing npcs: ', response);
        utils.success(
            context,
            'Npc',
            'listed',
            {'items': response.Items}
        );
      }).catch(function (e) {
        utils.error(
            context,
            'Npc',
            'listed',
            'Error fetching npcs from database.',
            e
        );
      });
};
