'use strict';

/**
 * This Lambda Function returns the list of registered stories
 * @type {*|exports|module.exports}
 */

// Require Logic
var lib = require('../../lib');

// Lambda Handler
module.exports.handler = function (event, context) {

    console.log('Fetching stories users: ');
    lib.list('Story', 'ID,Title,TargetLanguage,TranslatedLanguage,CreatedDate', function (response) {
        console.log(response);
        if (response.success && response.data) {
            var items = response.data;
            if (!items) {
                items = [];
            }
            context.done(null, {
                'success': true,
                'message': 'Stories were fetched successfully.',
                'data': {'items': items}
            });
        } else {
            context.done(null, {'success': false, 'message': 'Unable to fetch stories.'});
        }
    });

};