import { alias } from '@ember/object/computed';
import C from 'shared/utils/constants';
import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { observer, computed, get } from '@ember/object';


export default Component.extend({
  layout,
  catalog:      service(),
  settings:     service(),
  scope:     service(),
  projectId:    alias(`cookies.${C.COOKIE.PROJECT}`),
  categories:   alias('model.categories'),
  modalService: service('modal'),
  search:       '',
  parentRoute:  null,
  launchRoute:  null,
  updating:     'no',

  actions: {
    clearSearch() {
      this.set('search', '');
    },
    update() {
      this.set('updating', 'yes');
      this.get('catalog').refresh().then(() => {
        this.set('updating', 'no');
        this.send('refresh');
      }).catch(() => {
        this.set('updating', 'error');
      });
    }
  },

  init() {
    this._super(...arguments);
    this.get('catalog.componentRequestingRefresh');
  },

  childRequestiongRefresh: observer('catalog.componentRequestingRefresh', function() {
    if (this.get('catalog.componentRequestingRefresh')) {
      this.send('update');
    }
  }),

  totalCategories: computed('categoryWithCounts', function() {
    var categories = this.get('categoryWithCounts');
    var count = 0;
    Object.keys(categories).forEach((cat) => {
      count = count + categories[cat].count;
    });
    return count;
  }),

  categoryWithCounts: computed('category', 'categories', function() {
    let categories = [];
    let out        = {};
    let templates  = this.get('catalog.templateCache');
    let base       = this.get('catalog.templateBase');
    let plusInfra  = this.get('scope.currentProject.clusterOwner') === true;

    templates.forEach((tpl) => {
      // TODO 2.0 does a kubernetes template need a category?
      if (base === tpl.get('templateBase') || (plusInfra && tpl.get('templateBase') === 'infra') || (tpl.get('templateBase') === 'kubernetes')) {
        if (tpl.categories) {
          tpl.categories.forEach((ctgy) => {
            categories.push(ctgy);
          });
        }
      }
    });

    categories.sort().forEach((ctgy) => {
      let normalized = ctgy.underscore();


      if (out[normalized] && ctgy !== 'all') {
        out[normalized].count++;
      } else {
        out[normalized] = {
          name: ctgy,
          count: 1,
        };
      }
    });

    return out;
  }),

  catalogURL: computed('model.catalogs', function() {
    var neu = {
      catalogs: {}
    };
    this.get('model.catalogs').forEach((cat) => {
      neu.catalogs[cat.id] = {
        branch: cat.branch,
        url: cat.url
      };
    });
    return JSON.stringify(neu);
  }),

  filters: computed('model.catalogs', function() {
    return this.get('globalStore').all('catalog').map((obj) => {
      return {
        catalogId: get(obj, 'id'),
        label: get(obj,'name'),
      };
    });
  }),

  arrangedContent: computed('model.catalog', 'search', function() {
    let search  = this.get('search').toUpperCase();
    let result  = [];
    let base    = this.get('catalog.templateBase');
    let catalog = this.get('model.catalog').filter((item) => {
      if (item.templateBase === base || item.templateBase === 'kubernetes' || item.templateBase === 'infra') {
        return true;
      }
      return false;
    });

    if (!search) {
      return catalog;
    }

    catalog.forEach((item) => {
      if (item.name.toUpperCase().indexOf(search) >= 0 || item.description.toUpperCase().indexOf(search) >= 0) {
        result.push(item);
      }
    });
    return result;
  }),
});
