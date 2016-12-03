import 'isomorphic-fetch';

import Vue from 'vue';
import router from './router';
import AppComponent from './components/App';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: (x) => x(AppComponent)
});
