// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
// import VueAxios from 'vue-axios';

// import 'element-ui/lib/theme-default/index.css';
// import ElementUI from 'element-ui';
// import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import store from './store';

Vue.prototype.$ajax = axios;
// Vue.use(axios, VueAxios);
// Vue.use(ElementUI);
// Vue.use(VueResource);
Vue.config.productionTip = false;
// Vue.directive('echarts', require('./directives/echarts'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
