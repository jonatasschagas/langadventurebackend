'use strict';

/**
 * This Lambda Function returns the list of registered quests
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {
    utils.log('Fetching quests: ', event);

    var storyId = event.storyId;

    if (!_.isEmpty(storyId)) {
        db.listByGSI('Quest',
            'ID,' +
            'Title,' +
            'Introduction,' +
            'IntroductionTranslation,' +
            'Completion,' +
            'CompletionTranslation,' +
            'QuestOrder,' +
            'CreatedDate',
            'StoryId',
            storyId).then(
            function (response) {
                utils.log('Listing quests: ', response);
                utils.success(
                    context,
                    'Quests',
                    'listed',
                    {'items': response.Items}
                );
            }
        ).catch(
            function (e) {
                utils.error(
                    context,
                    'Quests',
                    'listed',
                    'Error fetching quests from database.',
                    e
                );
            }
        );
    } else {
        utils.error(
            context,
            'Quest',
            'list',
            'Please provide a story Id in order to list the quests.',
            null
        );
    }
};
