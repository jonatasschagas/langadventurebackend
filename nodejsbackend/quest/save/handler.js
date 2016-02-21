'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing quest
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

module.exports.handler = function (event, context) {

    utils.log('saving quest: ', event);

    var id = event.id, questOrder = parseInt(event.questOrder),
        storyId = event.storyId, title = event.title,
        introduction = event.introduction, introductionTranslation = event.introductionTranslation,
        completion = event.completion, completionTranslation = event.completionTranslation, now = new Date();

    if (questOrder == null || _.isEmpty(title) || _.isEmpty(storyId)) {
        utils.error(
            context,
            'Quest',
            'saving',
            'Please provide the following parameters in ' +
            'order to save/update the quest: questOrder, title and story id.',
            null
        );
        return;
    }

    if (!_.isEmpty(id)) {
        db.update('Quest', id, {
            'LastUpdated': now.toDateString(),
            'QuestOrder': questOrder,
            'Title': title,
            'Introduction': introduction,
            'IntroductionTranslation': introductionTranslation,
            'Completion': completion,
            'CompletionTranslation': completionTranslation,
            'StoryId': storyId
        }).then(function (response) {
            utils.log('Quest has been updated successfully.', response);
            utils.success(context, 'Quest', 'updated', {});
        }).catch(function (e) {
            utils.error(
                context, 'Quest', 'updating',
                'Error updating the quest in the database.', e
            );
        });
    } else {

        db.save('Quest', {
            'ID': db.guid(),
            'QuestOrder': questOrder,
            'Title': title,
            'Introduction': introduction,
            'IntroductionTranslation': introductionTranslation,
            'Completion': completion,
            'CompletionTranslation': completionTranslation,
            'StoryId': storyId,
            'CreatedDate': now.toDateString(),
            'LastUpdated': now.toDateString()
        }).then(function (response) {
            utils.log('Quest has been saved successfully.', response);
            utils.success(context, 'Quest', 'saved', {});
        }).catch(function (e) {
            utils.error(
                context,
                'Quest',
                'saved',
                'Error saving the quest in the database.',
                e
            );
        });
    }
};
