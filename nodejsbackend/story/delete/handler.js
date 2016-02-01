'use strict';

/**
 * This Lambda Function deletes the given Story record based on the ID
 * @type {*|exports|module.exports}
 */

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {

    // logging event
    console.log(JSON.stringify(event));

    var id = event['id'];
    if (!id) {
        console.log('Error deleting story. Please provide an id.');
        context.done(null, {
            'success': false,
            'message': 'Error deleting story. Please provide an id.'
        });
        return
    }

    console.log('Deleting story id: ' + id);
    lib.deleteItem('Story', id, function (response) {
        console.log(response);
        if (response.success) {
            context.done(null, {
                'success': true,
                'message': 'Story was deleted successfully.'
            });
        } else {
            context.done(null, {'success': false, 'message': 'Unable to delete story.'});
        }
    });

};