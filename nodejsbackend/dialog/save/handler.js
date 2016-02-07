'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing dialog
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    // logging event
    utils.log('dialog saving: ', event);

    var id = event.id, title = event.title, storyId = event.storyId,
        whoStarts = event.whoStarts, nodes = event.nodes, now = new Date();

    if (_.isEmpty(title) || _.isEmpty(storyId) || _.isEmpty(whoStarts) || _.isEmpty(nodes)) {
        utils.error(
            context,
            'Dialog',
            'saving/updating',
            'Please provide a title, story, who starts the dialog and the dialog nodes.',
            null
        );
        return;
    }

    if (!_.isEmpty(id)) {
        db.update('Dialog', id, {
            'LastUpdated': now.toDateString(),
            'Title': title,
            'StoryId': storyId,
            'WhoStarts': whoStarts,
            'Nodes': nodes
        }).then(
            function () {
                utils.success(context, 'Dialog', 'updated', {});
            }
        ).catch(
            function (e) {
                utils.error(context, 'Dialog', 'updated', 'Error updating Dialog.', e);
            }
        );
    } else {
        db.save('Dialog', {
            'ID': db.guid(),
            'Title': title,
            'StoryId': storyId,
            'WhoStarts': whoStarts,
            'CreatedDate': now.toDateString(),
            'LastUpdated': now.toDateString(),
            'Nodes': nodes
        }).then(function () {
            utils.success(context, 'Dialog', 'saving', {});
        }).catch(function (e) {
            utils.error(
                context,
                'Dialog',
                'saving',
                'Error updating the dialog.',
                e
            );
        });
    }
};
