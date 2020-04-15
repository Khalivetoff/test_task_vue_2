<template>
  <div class="main-container">
    <div class="top-nav">
      <b-button
        v-show="$store.state.user_data.role == 'writer'"
        type="is-light"
        @click="$router.push({name: 'edit_post'})"
      >
        Добавить пост
      </b-button>
      <b-button
        class="button_enter"
        type="is-light"
        @click="enter()"
      >
        {{ button_text }}
      </b-button>
    </div>
    <div class="main-content">
      <div class="container">
        <div class="layout">
          <div v-if="$store.state.posts[10]">
            <b-pagination
              :total="total"
              :per-page="5"
              :current.sync="page_number"
              :range-before="3"
              :range-after="1"
              :order="''"
              :size="''"
              :simple="false"
              :rounded="false"
              :icon-prev="'chevron-left'"
              :icon-next="'chevron-right'"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
            >
            </b-pagination>
          </div>
          <div class="layout">
            <post-item
              class="post-item_fix-width"
              v-for="(item, index) in paginated_items"
              :post_data="item"
              :key="index"
            ></post-item>
          </div>
          <b-notification
            v-show="$store.state.data_is_ready && !$store.state.posts[0]"
            type="is-warning"
            aria-close-label="Close notification"
            role="alert">
            Нет активных постов
          </b-notification>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import PostItem from '../components/PostItem'

    export default {
        components: {
            'post-item': PostItem
        },
        data() {
            return {
              page_number: 1
            }
        },
        methods: {
            enter() {
                this.$store.state.user_data.id !== null ? this.$store.commit('resetUserData') : this.$router.push({name: 'auth'});
            }
        },
        computed: {
            button_text() {
                if (this.$store.state.user_data.id !== null) {
                    return 'Выйти';
                } else {
                    return 'Логин';
                }
            },
            total() {
                return this.$store.state.posts.length;
            },
            paginated_items() {
                if (this.$store.state.posts[10]) {
                    let page_number = this.page_number - 1;
                    return this.$store.state.posts.slice(page_number * 5, (page_number + 1) * 5);
                } else {
                    return this.$store.state.posts;
                }
            }
        }
    }
</script>

<style scoped>

  .layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }

  .post-item_fix-width {
    width: 620px;
    max-width: 100%;
    min-width: calc(100% - 32px);
  }

  .post-item_fix-width {
    margin-top: 15px;
  }

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    background: #704dd1;
    z-index: 5;
  }

  .button_enter {
    margin-left: 10px;
  }

  .main-content {
    padding-top: 66px;
  }

  .layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

</style>
