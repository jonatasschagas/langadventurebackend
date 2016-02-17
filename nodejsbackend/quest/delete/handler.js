'use strict';

/**
 * This Lambda Function deletes the given Quest record based on the ID
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('Delete quest:', event);

    var id = event.id;
    if (_.isEmpty(id)) {
        utils.error(context, 'Quest', 'deleted', 'Please provide an id.', null);
        return;
    }

    console.log('Deleting quest id: ' + id);
    db.deleteItem('Quest', id).then(function () {
        utils.success(context, 'Quest', 'deleted', null);
    }).catch(function (e) {
        utils.error(
            context,
            'Quest',
            'deleting',
            'Error deleting quest from the database.',
            e
        );
    });
};
