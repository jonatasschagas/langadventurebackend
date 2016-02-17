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
    db.list('Quest',
        'ID,' +
        'Title,' +
        'Introduction,' +
        'Completion,' +
        'QuestOrder,' +
        'QuestState,' +
        'Description,' +
        'CreatedDate')
    .then(function (response) {
        utils.log('Listing quests: ', response);
        utils.success(
            context,
            'Quests',
            'listed',
            {'items': response.Items}
        );
    }).catch(function (e) {
        utils.error(
            context,
            'Quests',
            'listed',
            'Error fetching quests from database.',
            e
        );
    });
};
