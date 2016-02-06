'use strict';

/**
 * This file contains utility functions
 */

var _ = require('lodash-node');

function success(context, itemName, operation, data) {
    context.done(null, {
        'success': true,
        'message': itemName + ' ' + operation + ' successfully.',
        'data': data
    });
}

function error(context, itemName, operation, message, e) {
    message = operation + ' '
        + itemName + ' to/from the database. '
        + message;
    console.error(message, e);
    context.fail(new Error(message, e));
}

function log(message, object) {
    console.log(message + JSON.stringify(object));
}

module.exports = {
    success: success,
    error: error,
    log: log
};