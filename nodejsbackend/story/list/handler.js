'use strict';

/**
 * This Lambda Function returns the list of registered stories
 * @type {*|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {
    utils.log('Fetching stories: ', event);
    db.list('Story',
        'ID,' +
        'Title,' +
        'TargetLanguage,' +
        'TranslatedLanguage,' +
        'CreatedDate')
        .then(function (response) {
            utils.log('Listing stories: ', response);
            utils.success(
                context,
                'Stories',
                'listed',
                {'items': response.Items}
            );
        }).catch(function (e) {
            utils.error(
                context,
                'Stories',
                'listed',
                'Error fetching stories from database.',
                e
            );
        });
};
