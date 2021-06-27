<template>
  <section class="login">
    <div class="background"></div>
    <div class="login-form" :class="{ shaking: error }">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Вход" name="login">
          <el-form auto-complete="off" :model="model" :rules="formRules" ref="formEl" label-position="top">
            <h2 class="heading">Вход в систему</h2>
            <el-form-item label="Логин" prop="username">
              <el-input
                type="text"
                v-model="model.username"
                placeholder="Пожалуйста, введите имя пользователя"
              />
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
              <el-input type="password" v-model="model.password" placeholder="Пожалуйста, введите пароль" />
            </el-form-item>
            <el-button type="primary" :loading="loading" @click="login">{{
              loading ? "Загрузка..." : "Авторизоваться"
            }}</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Регистрация" name="signup">
          <el-form auto-complete="off" :model="model" :rules="formRules" ref="signUpEl" label-position="top">
            <h2 class="heading">Регистрация</h2>
            <el-form-item label="Логин" prop="username">
              <el-input
                type="text"
                v-model="model.username"
                placeholder="Пожалуйста, введите имя пользователя"
              />
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
              <el-input type="password" v-model="model.password" placeholder="Пожалуйста, введите пароль" />
            </el-form-item>
            <el-button type="primary" :loading="loading" @click="signup">{{
              loading ? "Загрузка..." : "Зарегистрироватся"
            }}</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <footer class="login-footer">
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon />
    </footer>
  </section>
</template>
<script lang="ts">
import Axios from "axios";
import { ElFormContext, ElFormItemContext } from "element-plus/lib/el-form";

type loginFormData = { username: string; password: string };
type ErrorMessage = {
  title: string;
  message: string;
};
const formRules = {
  username: [
    { required: true, message: "Требуется имя пользователя" },
    {
      min: 2,
      max: 26,
      message: "Имя пользователя должно быть от 2 до 26 символов",
    },
  ],
  password: [
    { required: true, message: "Требуется пароль" },
    {
      min: 4,
      max: 16,
      message: "Пароль должен быть от 4 до 16 символов",
    },
  ],
};
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "Login",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    const formEl = ref<ElFormItemContext>();
    const signUpEl = ref<ElFormItemContext>();
    const error = ref<ErrorMessage | null>(null);
    const loading = ref(false);
    const activeTab = ref("login");
    const model = ref({
      username: "arman@sergazin.kz",
      password: "jav.kz",
    });
    const store = useStore();
    const router = useRouter();
    onMounted(() => store.state.user !== null && router.push("/"));
    watch(
      computed(() => store.state.user),
      (nw: null | unknown) => {
        if (nw !== null) router.push("/");
      }
    );

    async function reg(form: loginFormData) {
      try {
        const res = await Axios.post("auth/signup", form);
        loading.value = false;
        ElMessage("Вы зарегистрированны, войдите в аккаунт");
        activeTab.value = "login";
      } catch (e) {
        error.value = {
          title: "Произошла ошибка",
          message: "Пожалуйста, попробуйте еще раз позже!",
        };
        switch (e.response && e.response.status) {
          case 401:
            error.value.message = e.response.data.message;
            break;
          case 500:
            error.value.message = "Внутренняя ошибка сервера, пожалуйста, повторите попытку позже!";
            break;
        }
        loading.value = false;
      }
    }
    async function auth(form: loginFormData) {
      try {
        const res = await Axios.post("auth/login", form);
        location.reload();
        loading.value = false;
      } catch (e) {
        error.value = {
          title: "Произошла ошибка",
          message: "Пожалуйста, попробуйте еще раз позже!",
        };
        switch (e.response && e.response.status) {
          case 401:
            error.value.message = "Неверное имя пользователя или пароль!";
            break;
          case 500:
            error.value.message = "Внутренняя ошибка сервера, пожалуйста, повторите попытку позже!";
            break;
        }
        loading.value = false;
      }
    }
    function signup() {
      // form validate
      signUpEl.value?.validate((valid?: boolean) => {
        if (!valid) return false;
        // validated
        error.value = null;
        loading.value = true;
        reg(model.value);
      });
    }
    function login() {
      // form validate
      formEl.value?.validate((valid?: boolean) => {
        if (!valid) return false;
        // validated
        error.value = null;
        loading.value = true;
        auth(model.value);
      });
    }
    return {
      error,
      loading,
      model,
      formRules,
      login,
      signUpEl,
      signup,
      activeTab,
      formEl,
    };
  },
  methods: {},
});
</script>

<style lang="scss">
$login-form-color: #222;
$login-form-background: rgba(255, 255, 255, 0.8);

@mixin inner {
  width: 95%;
  max-width: 22em;
  margin: 0 auto;
}

.login {
  position: relative;
  .background {
    z-index: -1;
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    height: 100%;
    width: 100%;
    position: absolute;
    opacity: 0.7;
    -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
    background-image: url(/assets/img/background.jpg);
    height: 100%;
  }
  height: calc(100% - 60px);
  flex: 1;
  font-size: 1em;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .login-form {
    margin-top: 5em;
    padding: 2em 3em;
  }
  &-form {
    @include inner;
    margin-bottom: 2.5em;
    padding: 1.875em 1.25em;
    background: $login-form-background;
    color: $login-form-color;
    .heading {
      margin: 0 0 1em;
      font-weight: 400;
      font-size: 1.5em;
    }
    .el-button {
      margin-top: 0.5em;
      width: 100%;
    }
    &.shaking {
      animation: shakeX 1s;
    }
  }
  &-footer {
    @include inner;
    margin-bottom: 1em;
    text-align: center;
    .el-alert__description,
    .el-alert__title {
      font-size: 1em;
    }
    a {
      //color: $primary-color;
    }
  }
}
@keyframes shakeX {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-0.5em, 0, 0);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translate3d(0.5em, 0, 0);
  }
}
label {
  font-weight: bold;
}
</style>
