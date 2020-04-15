import Vue from 'vue'
import App from './App.vue'
import {store} from './plugins/store'
import {router} from './plugins/router'
import axios from 'axios'
Vue.prototype.axios = axios;
import Buefy from 'buefy'
import './assets/buefy.css'
Vue.use(Buefy)
import moment from 'moment'
Vue.prototype.moment = moment;

var app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
