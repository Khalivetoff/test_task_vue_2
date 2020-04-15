<template>
  <div class="container">
    <div class="layout">
      <section>
        <b-field
          label="Заголовок поста"
          :type="{ 'is-danger' : check_title_field }"
          :message="check_title_field"
        >
          <b-input
            v-model="edit_post.title"
          ></b-input>
        </b-field>
        <b-field
          label="Текст поста"
          :type="{ 'is-danger' : check_text_field }"
          :message="check_text_field"
        >
          <b-input
            maxlength="240"
            type="textarea"
            v-model="edit_post.description"
          ></b-input>
        </b-field>
        <div class="button-wrapper">
          <b-button
            type="is-success"
            @click="savePost()"
          >Сохранить
          </b-button>
        </div>
      </section>
    </div>
    <b-button
      class="buttom_back-to-post"
      type="is-light"
      @click="$router.push({name: 'main'}); $store.commit('clearEditPost')"
    >
      Назад к постам
    </b-button>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                is_try_enter_data: false,
                edit_post: {},
            }
        },
        methods: {
            savePost() {
                if (this.disable_button) {
                    return;
                }
                this.is_try_enter_data = true;
                if (this.check_title_field || this.check_text_field) {
                    return;
                }
                let date_now = this.moment().toISOString();
                this.edit_post.updatedAt = date_now;
                if (this.edit_post.id !== null) {
                    this.axios.patch(this.$store.state.local_address + '/posts/' + this.edit_post.id, this.edit_post)
                        .then(response => {
                            if (!response.data || !response.data.id) {
                                this.danger('Произошла ошибка при сохранении');
                            } else {
                                this.$store.commit('setNewValuePost', this.edit_post);
                                this.info('Пост успешно изменен');
                                this.$router.push({name: 'main'});
                                this.$store.commit('clearEditPost');
                            }
                            this.disable_button = false;
                        })
                        .catch((error) => {
                            console.log(error);
                            this.disable_button = false;
                        })
                } else {
                    this.edit_post.userId = this.$store.state.user_data.id;
                    this.edit_post.createdAt = date_now;
                    this.axios.post(this.$store.state.local_address + '/posts/', this.edit_post)
                        .then(response => {
                            if (!response.data || !response.data.id) {
                                this.danger('Произошла ошибка при сохранении');
                            } else {
                                this.$store.commit('setNewValuePost', this.edit_post);
                                this.info('Пост успешно создан');
                                this.$router.push({name: 'main'});
                                this.$store.dispatch('getPostsData')
                                this.$store.commit('clearEditPost');
                            }
                            this.disable_button = false;
                        })
                        .catch((error) => {
                            console.log(error);
                            this.disable_button = false;
                        })
                }
            },
            danger(text) {
                this.$buefy.snackbar.open({
                    duration: 2000,
                    message: text,
                    type: 'is-danger',
                    position: 'is-bottom-right',
                    actionText: 'Undo',
                    queue: false,
                    onAction: () => {
                        this.$buefy.toast.open({
                            message: 'Action pressed',
                            queue: false
                        })
                    }
                })
            },
            info(text) {
                this.$buefy.snackbar.open({
                    duration: 2000,
                    message: text,
                    type: 'is-danger',
                    position: 'is-bottom-right',
                    actionText: 'Undo',
                    queue: false,
                    onAction: () => {
                        this.$buefy.toast.open({
                            message: 'Action pressed',
                            queue: false
                        })
                    }
                })
            },
        },
        computed: {
            check_title_field() {
                if (this.edit_post.title == '' && this.is_try_enter_data) {
                    return 'Обязательно укажите заголовок поста';
                }
                return '';
            },
            check_text_field() {
                if (this.edit_post.description == '' && this.is_try_enter_data) {
                    return 'Обязательно введите текст поста';
                } else if (this.edit_post.description.length < 20 && this.is_try_enter_data) {
                    return 'Минимальная длина текста 20 символов';
                } else {
                    return '';
                }
            }
        },
        created() {
            this.edit_post = this.$store.state.edit_post
        }
    }
</script>

<style scoped>

  .container {
    margin: 0px;
    width: 100%;
    max-width: 100%;
  }

  .layout {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section {
    min-width: 280px;
    width: 620px;
    max-width: 100%;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .field {
    min-height: 90px;
  }

  .buttom_back-to-post {
    position: absolute;
    right: 10px;
    top: 10px;
  }

</style>
