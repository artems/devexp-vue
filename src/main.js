import 'isomorphic-fetch';

import Vue from 'vue';
import router from './router';
import AppComponent from './components/App';

export const _vue = new Vue({
  el: '#app',
  router,
  render: (x) => x(AppComponent)
});
