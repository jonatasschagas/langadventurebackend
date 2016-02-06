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

    var id = event['id'];
    var title = event['title'];
    var storyId = event['storyId'];
    var whoStarts = event['whoStarts'];
    var nodes = event['nodes'];
    var now = new Date();

    if (_.isEmpty(title) || _.isEmpty(storyId)
        || _.isEmpty(whoStarts) || _.isEmpty(nodes)) {
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
        db.saveOrUpdate('Dialog', id, {
            'LastUpdated': now.toDateString(),
            'Title': title,
            'StoryId': storyId,
            'WhoStarts': whoStarts,
            'Nodes': nodes
        })
            .then(function () {
                db.get('Dialog', fbUserId)
                    .then(function (getResponse) {
                        if (!_.isEmpty(getResponse.Item)
                            && !_.isEmpty(getResponse.Item.ID)) {
                            utils.success(
                                context,
                                'Admin User',
                                'updating',
                                getResponse.Item.UserRoles
                            );
                        }
                    });
            })
            .catch(function (e) {
                utils.error(
                    context,
                    'Dialog',
                    'updating',
                    'Error updating Dialog.',
                    e);
            });
    } else {
        db.saveOrUpdate('Dialog', id, {
            'ID': db.guid(),
            'Title': title,
            'StoryId': storyId,
            'WhoStarts': whoStarts,
            'CreatedDate': now.toDateString(),
            'LastUpdated': now.toDateString(),
            'Nodes': nodes
        })
            .then(utils.success(context, 'Dialog', 'saving', {}))
            .catch(utils.error(
                context,
                'Dialog',
                'saving',
                'Error updating the dialog.', e));
    }
};
