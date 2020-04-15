import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import axios from 'axios'
import {router} from '../plugins/router.js'

export const store = new Vuex.Store({
  state: {
    local_address: 'http://' + window.location.hostname + ':3000',
    posts: [],
    data_is_ready: false,
    user_data: {
      id: null,
      login: '',
      password: '',
      role: ''
    },
    user_data_empty: {
      id: null,
      login: '',
      password: '',
      role: ''
    },
    edit_post: {
      id: null,
      title: '',
      description: '',
      claps: 0,
      userId: null
    },
    edit_post_empty: {
      id: null,
      title: '',
      description: '',
      claps: 0,
      userId: null
    },
    date_now: null,
    modal_title_post_edit: '',
  },
  mutations: {
    setNewValuePosts(state, val) {
      state.posts = val;
    },
    setUserData(state, val) {
      state.user_data = val;
    },
    resetUserData(state) {
      state.user_data = JSON.parse(JSON.stringify(state.user_data_empty));
      localStorage.removeItem('user_data');
    },
    setDateNow(state, val) {
      state.date_now = val;
    },
    deleteItemFromPostsArr(state, id) {
      state.posts = state.posts.filter(item => {return item.id !== id});
    },
    setEditPost(state, post_data) {
      state.edit_post = post_data;
    },
    setNewValuePost(state, val) {
      for (let item of state.posts) {
        if (item.id == val.id) {
          for (let key in item) {
            item[key] = val[key];
          }
        }
      }
    },
    addClap(state, post_id) {
        state.posts.forEach(item => {
          if (item.id == post_id) {
            item.claps++;
          }
        })
    },
    clearEditPost(state) {
      state.edit_post = JSON.parse(JSON.stringify(state.edit_post_empty));
    }
  },
  actions: {
    getPostsData({ commit, state }) {
      axios.get(state.local_address + '/posts')
        .then(response => {
          if (!response.data || !response.data[0]) {
            commit('setNewValuePosts', []);
          } else {
            response.data = response.data.reverse();
            commit('setNewValuePosts', response.data);
          }
          state.data_is_ready = true;
        })
    },
    getUserData({ commit, state }, login) {
      return new Promise((resolve) => {
        state.user_data = {};
        axios.get(state.local_address + '/users?login=' + login.login)
          .then(response => {
            if (!response.data || !response.data[0] || response.data[0].password !== login.password) {
              resolve('null-data');
            } else  {
              commit('setUserData', response.data[0]);
              resolve('success');
            }
          })
          .catch((error) => {
            console.log(error);
            resolve('error');
          })
      })
    }
  }
})
