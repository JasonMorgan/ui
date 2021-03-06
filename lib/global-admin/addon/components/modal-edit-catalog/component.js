import { alias, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import NewOrEdit from 'shared/mixins/new-or-edit';
import ModalBase from 'shared/mixins/modal-base';
import layout from './template';
import { set } from '@ember/object';

export default Component.extend(ModalBase, NewOrEdit, {
  layout,
  classNames: ['medium-modal'],
  originalModel: alias('modalService.modalOpts'),
  editing: notEmpty('originalModel.id'),
  model: null,

  allNamespaces: null,
  allProjects: null,

  init() {
    this._super(...arguments);

    var orig = this.get('originalModel');
    var clone = orig.clone();
    set(clone, 'kind', 'helm'); // until native works?
    set(this, 'model', clone);
  },

  doneSaving: function() {
    this.send('cancel');
  },

  kindChoices: [
    {translationKey: 'catalogSettings.more.kind.native', value: 'native'},
    {translationKey: 'catalogSettings.more.kind.helm', value: 'helm'},
  ],
});
