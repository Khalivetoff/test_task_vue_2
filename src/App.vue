<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
        methods: {
            checkLS() {
                let user_data_from_ls = JSON.parse(localStorage.getItem('user_data')) ?
                    JSON.parse(localStorage.getItem('user_data')) : {};
                if (user_data_from_ls.login) {
                    this.$store.dispatch('getUserData', user_data_from_ls)
                        .then(response => {
                            if (response == 'success' && this.$router.currentRoute.name == 'auth') {
                                this.$router.push({name: 'main'});
                            }
                        })
                }
            }
        },
        created() {
            this.$store.dispatch('getPostsData');
            this.$store.commit('setDateNow', this.moment().toISOString());
            this.checkLS();
        }
    }
</script>

<style>

  html {
    overflow: auto;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
  }

  .container {
    height: 100%;
    padding: 0px 16px;
  }

  * {
    box-sizing: border-box;
    margin: 0px;
  }
</style>
