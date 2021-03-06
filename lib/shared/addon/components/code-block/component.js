import Component from '@ember/component';
import layout from './template';
import { observer } from '@ember/object'

export default Component.extend({
  layout,
  language:          'javascript',
  code:              '',
  hide:              false,
  constrained:       true,

  tagName:           'PRE',
  classNames:        ['line-numbers'],
  classNameBindings: ['languageClass','hide:hide','constrained:constrained'],

  languageClass: function() {
    var lang = this.get('language');
    if ( lang )
    {
      return 'language-'+lang;
    }
  }.property('language'),

  didReceiveAttrs() {
    this.highlightedChanged();
  },

  highlighted: null,
  highlightedChanged: observer('language','code', function() {
    var lang = this.get('language');
    this.set('highlighted', Prism.highlight(this.get('code')||'', Prism.languages[lang], lang));
  }),
});
