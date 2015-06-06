'use strict';
angular.module('archCarto')
  .factory('archAuditService', function() {
    var _auditEvents = {
      editable: [
        'ADDED',
        'UPDATED'
      ],
      notEditable: [
        'AWAITING_ADDITION',
        'AWAITING_UPDATE',
        'AWAITING_DELETION',
        'DELETED'
      ]
    };

    var _colors = {
      AWAITING_ADDITION: 'purple',
      AWAITING_UPDATE: 'blue',
      AWAITING_DELETE: 'red',
      ADDED: 'green',
      UDPATED: 'green'
    };

    return {
      isEditable: function(eventName) {
        // FOR DEBUG
        return true;
        //
        if (_auditEvents.editable.indexOf(eventName) > -1) {
          return true;
        } else if (_auditEvents.notEditable.indexOf(eventName) > -1) {
          return false;
        } else {
          throw new Error('Given audit event name ' + eventName + ' not recognized.');
        }
      },
      getColor: function(eventName) {
        return _colors[eventName];
      }
    };
  });
