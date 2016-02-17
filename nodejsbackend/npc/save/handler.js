'use strict';

/**
 * This Lambda Function performs the following:
 *  - Creates a new or Updates an existing npc
 *
 * @type {AWS|exports|module.exports}
 */

var db = require('../../lib/dynamo-db-utils');
var utils = require('../../lib/utils');
var _ = require('lodash-node');

// Lambda Handler
module.exports.handler = function (event, context) {

    utils.log('saving npc: ', event);

    var id = event.id, npcNames = event.npcNames, description = event.description, now = new Date();

    if (_.isEmpty(npcNames)) {
        utils.error(
            context,
            'Npc',
            'saved',
            'Please provide the names for the NPC.',
            null
        );
        return;
    }

    if (!_.isEmpty(id)) {
        db.update('Npc', id, {
            'LastUpdated': now.toDateString(),
            'NpcNames': npcNames,
            'Description': description
        }).then(function (response) {
            utils.log('Npc has been updated successfully.', response);
            utils.success(context, 'Npc', 'updated', {});
        }).catch(function (e) {
            utils.error(
                context,
                'Npc',
                'updating',
                'Error updating the npc in the database.',
                e
            );
        });
    } else {
        db.save('Npc', {
            'ID': db.guid(),
            'NpcNames': npcNames,
            'Description': description,
            'CreatedDate': now.toDateString(),
            'LastUpdated': now.toDateString()
        }).then(function (response) {
            utils.log('Npc has been updated successfully.', response);
            utils.success(context, 'Npc', 'saved', {});
        }).catch(function (e) {
            utils.error(
                context,
                'Npc',
                'saved',
                'Error saving the npc in the database.',
                e
            );
        });
    }
};
