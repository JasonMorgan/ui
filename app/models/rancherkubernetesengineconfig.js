import Resource from 'ember-api-store/models/resource';

var RancherKubernetesEngineConfig = Resource.extend({
  type: 'rancherKubernetesEngineConfig',

  reservedKeys: [],

  actions: {
    deactivate() {
      return this.doAction('deactivate');
    },

    activate() {
      return this.doAction('activate');
    },

    edit: function() {
    },
  },

  availableActions: function() {
    let a = this.get('actionLinks');
    let l = this.get('links');

    return [
      { label: 'action.edit',       icon: 'icon icon-edit',         action: 'edit',         enabled: !!l.update },
      { divider: true },
      { label: 'action.activate',   icon: 'icon icon-play',         action: 'activate',     enabled: !!a.activate , bulkable: true},
      { label: 'action.deactivate', icon: 'icon icon-pause',        action: 'deactivate',   enabled: !!a.deactivate , bulkable: true},
      { divider: true },
      { label: 'action.remove',     icon: 'icon icon-trash',        action: 'promptDelete', enabled: !!l.remove, altAction: 'delete', bulkable: true },
      { divider: true },
      { label: 'action.viewInApi',  icon: 'icon icon-external-link',action: 'goToApi',      enabled: true },
    ];
  }.property('actionLinks.{activate,deactivate,restore}','links.{update,remove}'),

});

export default RancherKubernetesEngineConfig;
