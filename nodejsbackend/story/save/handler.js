'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing story
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
    var targetLanguage = event['targetLanguage'];
    var translatedLanguage = event['translatedLanguage'];
    var now = new Date();

    if (!title || !targetLanguage || !translatedLanguage) {
        console.log('Error saving/updating story. Please provide a title, target language and translated language.');
        context.done(null, {
            'success': false,
            'message': 'Error saving/updating story. Please provide a title, target language and translated language.'
        });
        return
    }

    if (id) {
        lib.get('Story', id, function (response) {
            console.log('get response: ' + JSON.stringify(response));
            if (response.success && response.data) {
                console.log('Updating story: ' + title);
                lib.update('Story', id, {
                    'LastUpdated': now.toDateString(),
                    'Title': title,
                    'TargetLanguage': targetLanguage,
                    'TranslatedLanguage': translatedLanguage
                }, function (success) {
                    if (success) {
                        context.done(null, {
                            'success': true,
                            'message': 'Story updated successfully.'
                        });
                    } else {
                        context.done(null, {'success': false, 'message': 'Error saving/updating story.'});
                    }
                });
            } else {
                context.done(null, {'success': false, 'message': 'Error saving/updating story'});
            }
        });
    } else {
        console.log('Saving new story: ' + title);
        lib.save(
            'Story',
            {
                'ID': lib.guid(),
                'Title': title,
                'TargetLanguage': targetLanguage,
                'TranslatedLanguage': translatedLanguage,
                'CreatedDate': now.toDateString(),
                'LastUpdated': now.toDateString()
            },
            function (success) {
                if (success) {
                    context.done(null, {
                        'success': true,
                        'message': 'Story saved successfully.'
                    });
                } else {
                    context.done(null, {'success': false, 'message': 'Error saving story'});
                }
            }
        );
    }
};
