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

    utils.log('Delete dialog:', event);

    var id = event.id;
    if (_.isEmpty(id)) {
        utils.error(context, 'Dialog', 'deleted', 'Please provide an id.', null);
        return;
    }

    console.log('Deleting dialog id: ' + id);
    db.deleteItem('Dialog', id).then(function () {
        utils.success(context, 'Dialog', 'deleted', null);
    }).catch(function (e) {
        utils.error(
            context,
            'Dialog',
            'deleted',
            'Error deleting dialog from the database.',
            e
        );
    });
};
