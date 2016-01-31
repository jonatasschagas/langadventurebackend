'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing dialog
 *
 * @type {AWS|exports|module.exports}
 */

var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {
    // logging event
    console.log(JSON.stringify(event));

    var id = event['id'];
    var title = event['title'];
    var nodes = event['nodes'];
    var now = new Date();

    if (!title || !nodes) {
        console.log('Error saving/updating dialog. Please provide a title and the dialog nodes.');
        context.done(null, {
            'success': false,
            'message': 'Error saving/updating dialog. Please provide a title and the dialog nodes.'
        });
        return
    }

    if (id) {
        lib.get('Dialog', id, function (response) {
            console.log('get response: ' + JSON.stringify(response));
            if (response.success && response.data) {
                console.log('Updating dialog: ' + title);
                lib.update('Dialog', id, {
                    'LastUpdated': now.toDateString(),
                    'Title': title,
                    'Nodes': nodes
                }, function (success) {
                    if (success) {
                        context.done(null, {
                            'success': true,
                            'message': 'Dialog updated successfully.'
                        });
                    } else {
                        context.done(null, {'success': false, 'message': 'Error saving/updating dialog.'});
                    }
                });
            } else {
                context.done(null, {'success': false, 'message': 'Error saving/updating dialog'});
            }
        });
    } else {
        console.log('Saving/Updating new dialog: ' + title);
        lib.save(
            'Dialog',
            {
                'ID': lib.guid(),
                'Title': title,
                'CreatedDate': now.toDateString(),
                'LastUpdate': now.toDateString(),
                'Nodes': nodes
            },
            function (success) {
                if (success) {
                    context.done(null, {
                        'success': true,
                        'message': 'Dialog saved successfully.'
                    });
                } else {
                    context.done(null, {'success': false, 'message': 'Error saving dialog'});
                }
            }
        );
    }
};
