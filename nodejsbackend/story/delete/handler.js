'use strict';

/**
 * This Lambda Function deletes the given Story record based on the ID
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('Delete story:', event);

    var id = event.id;
    if (_.isEmpty(id)) {
        utils.error(context, 'Story', 'deleted', 'Please provide an id.', null);
        return;
    }

    console.log('Deleting story id: ' + id);
    db.deleteItem('Story', id).then(function () {
        utils.success(context, 'Story', 'deleted', null);
    }).catch(function (e) {
        utils.error(
            context,
            'Story',
            'deleting',
            'Error deleting story from the database.',
            e
        );
    });
};
