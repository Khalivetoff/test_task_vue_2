<template>
  <div class="wrapper">
    <div class="layout">
      <section class="auth-section">
        <div class="title">Авторизация</div>
        <b-field
          label="Email"
          :message="check_login_field"
          :type="{'is-danger' : check_login_field}"
        >
          <b-input
            label="Email"
            v-model="login_data.login"
          >
          </b-input>
        </b-field>
        <b-field
          label="Password"
          :message="[{'Мин. длина пароля - 8 символов' : check_password_field}]"
          :type="{'is-danger' : check_password_field}"
        >
          <b-input
            v-model="login_data.password"
            type="password"
          ></b-input>
        </b-field>
        <div class="bottom-content">
          <div>
            <b-notification
              class="notification"
              v-show="view_alert"
              type="is-danger"
              aria-close-label="Close notification"
              role="alert"
            >
              {{ notif_text }}
            </b-notification>
          </div>
          <b-button
            class="button_enter"
            type="is-success"
            @click="enter()"
          >Войти
          </b-button>
        </div>
      </section>
    </div>
    <b-button
      class="buttom_back-to-post"
      type="is-light"
      @click="$router.push({name: 'main'})"
    >
      Назад к постам
    </b-button>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                login_data: {
                    login: '',
                    password: ''
                },
                is_try_enter_data: false,
                disable_button: false,
                view_alert: false,
                notif_text: ''
            }
        },
        methods: {
            enter() {
                if (this.disable_button) {
                    return;
                }
                this.is_try_enter_data = true;
                if (this.check_password_field || this.check_login_field) {
                    return;
                }
                this.disable_button = true;
                this.notif_text = '';
                this.$store.dispatch('getUserData', this.login_data)
                    .then(response => {
                        if (response == 'success') {
                            this.$router.push({name: 'main'});
                            localStorage.setItem('user_data', JSON.stringify({
                                login: this.$store.state.user_data.login,
                                password: this.$store.state.user_data.password
                            }))
                            return;
                        } else if (response == 'error') {
                            this.notif_text = 'Ошибка при выполнении запроса';
                        } else {
                            this.notif_text = 'Данные не подходят';
                        }
                        this.disable_button = false;
                        this.view_alert = true;
                        setTimeout(() => {
                            this.view_alert = false;
                        }, 2000)
                    })
            }
        },
        computed: {
            check_password_field() {
                return this.login_data.password.length < 8 && this.is_try_enter_data;
            },
            check_login_field() {
                if (!this.login_data.login.includes('@') && this.is_try_enter_data) {
                    return 'В поле email, кажется, "@" не хватает';
                } else if (!this.login_data.login.split('@')[0] && this.is_try_enter_data) {
                    return 'В поле email перед "@" ничего нет, а должно быть';
                } else if (!this.login_data.login.split('@')[1] && this.is_try_enter_data) {
                    return 'В поле email после "@" ничего нет, а должно быть';
                } else {
                    return '';
                }
            }
        }
    }
</script>

<style scoped>

  .wrapper {
    height: 100%;
  }

  .layout {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .title {
    color: #363636;
    font-size: 1.2rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: solid 2px rgba(229, 232, 236, 0.604);
  }

  .auth-section {
    max-width: 350px;
    width: 350px;
    min-width: 280px;
    padding: 1.5rem;
    border-radius: 9px;
    box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
  }

  .field {
    min-height: 90px;
  }

  .bottom-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .notification {
    margin: 0px;
    padding: 6px 40px 6px 12px;
  }

  .buttom_back-to-post {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  @media (max-width: 599px) {

    .auth-section {
      padding: 1rem;
    }

    .title {
      padding-bottom: .5rem;
      margin-bottom: .5rem;
    }

  }

</style>
