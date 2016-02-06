'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing story
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('saving story: ', event);

    var id = event.id, title = event.title, targetLanguage = event.targetLanguage,
        translatedLanguage = event.translatedLanguage, now = new Date();

    if (_.isEmpty(title) || _.isEmpty(targetLanguage) || _.isEmpty(translatedLanguage)) {
        utils.error(
            context,
            'Story',
            'saved',
            'Please provide a title, target language and translated language.',
            null
        );
        return;
    }

    if (!_.isEmpty(id)) {
        db.saveOrUpdate('Story', id, {
            'LastUpdated': now.toDateString(),
            'Title': title,
            'TargetLanguage': targetLanguage,
            'TranslatedLanguage': translatedLanguage
        }).then(
            utils.success(
                context,
                'Story',
                'updated',
                {}
            )
        ).catch(
            function (e) {
                utils.error(
                    context,
                    'Story',
                    'updating',
                    'Error updating the story in the database.',
                    e
                );
            }
        );
    } else {
        db.saveOrUpdate('Story', id, {
            'ID': db.guid(),
            'Title': title,
            'TargetLanguage': targetLanguage,
            'TranslatedLanguage': translatedLanguage,
            'CreatedDate': now.toDateString(),
            'LastUpdated': now.toDateString()
        }).then(
            utils.success(
                context,
                'Story',
                'saving',
                {}
            )
        ).catch(
            function (e) {
                utils.error(
                    context,
                    'Story',
                    'saving',
                    'Error saving the story in the database.',
                    e
                );
            }
        );
    }
};
