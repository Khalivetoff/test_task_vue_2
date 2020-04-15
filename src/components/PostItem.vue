<template>
  <div class="post-item">
    <div class="container">
      <div class="title">{{ local_post_data.title }}</div>
      <div class="text">{{ local_post_data.description }}</div>
      <div class="layout">
        <div class="date">{{ diffDate }}</div>
        <div class="buttons-wrapper layout">
          <b-button
            v-show="$store.state.user_data.role == 'reader'"
            type="is-light"
            @click="addClaps()"
          >
            {{ local_post_data.claps }}
          </b-button>
          <b-button
            v-show="$store.state.user_data.role == 'writer'"
            type="is-light"
            @click="editPost()"
          >
            Изменить
          </b-button>
          <b-button
            style="margin-left: 10px"
            v-show="$store.state.user_data.role == 'writer'"
            type="is-light"
            @click="deletePost()"
          >
            Удалить
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        props: ['post_data'],
        data() {
            return {
                disable_button: false,
                view_notif: false,
            }
        },
        methods: {
            editPost() {
                this.$store.commit('setEditPost', Object.assign({}, this.local_post_data));
                this.$router.push({name: 'edit_post'})
            },
            addClaps() {
                if (this.disable_button) {
                    return;
                }
                this.disable_button = true;
                let data = JSON.parse(JSON.stringify(this.local_post_data));
                data.claps++;
                this.axios.patch(this.$store.state.local_address + '/posts/' + this.local_post_data.id, data)
                    .then(response => {
                        if (!response.data || !response.data.id) {
                            this.danger('Произошла ошибка при хлопанье, повторите еще раз');
                        } else {
                            this.local_post_data = response.data;
                            this.$store.commit('addClap', this.local_post_data.id);
                        }
                        this.disable_button = false;
                    })
                    .catch((error) => {
                        console.log(error);
                        this.disable_button = false;
                    })
            },
            deletePost() {
                if (this.disable_button) {
                    return;
                }
                this.disable_button = true;
                let data = JSON.parse(JSON.stringify(this.local_post_data));
                this.axios.delete(this.$store.state.local_address + '/posts/' + this.local_post_data.id)
                    .then(response => {
                        /**тут должна быть обработка ответа, но без бека его особо и не сделать, поэтому
                         * будем считать, что ошибок нет*/
                        this.$store.commit('deleteItemFromPostsArr', this.local_post_data.id);
                        this.info('Пост успешно удален');
                        this.disable_button = false;
                    })
                    .catch((error) => {
                        console.log(error);
                        this.disable_button = false;
                    })
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
            }
        },
        computed: {
            diffDate() {
                let day_diff = this.moment(this.$store.state.date_now).diff(this.moment(this.local_post_data.createdAt), 'days');
                if (day_diff == 0) {
                    return 'Сегодня';
                } else if (day_diff == 1) {
                    return 'Вчера';
                } else if (day_diff < 365) {
                    return day_diff +  ' дней назад';
                } else {
                    return 'более года назад';
                }
            },
            local_post_data: {
                get: function(){
                    return this.post_data;
                },
                set: function(newValue){
                    this.$emit('update:local_post_data', newValue)
                }
            }
        },
    }
</script>

<style scoped>
  .post-item {
    box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.12);
    border-radius: 9px;
    max-width: 100%;
  }

  .container {
    padding: 10px 18px;
  }

  .layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title {
    margin-bottom: .5rem;
    font-size: 1.5rem;
  }

  .text {
    overflow: hidden;
  }

  .date {
    color: #adadad;
    font-size: .9rem;
  }

  .buttons-wrapper {
    height: 36px;
  }

</style>
