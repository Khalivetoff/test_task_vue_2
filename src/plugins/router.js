import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import {store} from './store'

import Auth from '../components/Auth'
import Main from '../components/Main'
import EditPost from '../components/EditPost'

export const router = new VueRouter({
  routes: [
    {path: '/login', name: 'auth', component: Auth},
    {path: '', name: 'main', component: Main},
    {path: '/edit_post', name: 'edit_post', component: EditPost},
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.name == 'edit_post' && store.state.user_data.role !== 'writer') next({name: 'main'});
  else next();
})
