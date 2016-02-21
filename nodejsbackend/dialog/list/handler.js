'use strict';

/**
 * This Lambda Function returns the list of registered dialogs
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {
    utils.log('Fetching dialogs: ', event);

    var questId = event.questId;

    if (!_.isEmpty(questId)) {
        db.listByGSI('Dialog',
            'ID,' +
            'NpcId,' +
            'QuestId,' +
            'Nodes,' +
            'CreatedDate',
            'QuestCompletion',
            storyId).then(
            function (response) {
                utils.log('Listing dialogs: ', response);
                utils.success(
                    context,
                    'Dialogs',
                    'listed',
                    {'items': response.Items}
                );
            }
        ).catch(
            function (e) {
                utils.error(
                    context,
                    'Dialogs',
                    'listed',
                    'Error fetching dialogs from database.',
                    e
                );
            }
        );
    } else {
        utils.error(
            context,
            'Dialog',
            'list',
            'Please provide a quest Id in order to list the dialogs.',
            null
        );
    }
};
