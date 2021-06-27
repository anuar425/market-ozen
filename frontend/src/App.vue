<template>
  <i-header></i-header>
  <transition name="el-fade-in-linear">
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
  </transition>
  <i-footer></i-footer>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import iHeader from "./views/Header.vue";
import { useStore } from "vuex";
import iFooter from "./views/Footer.vue";

export default {
  name: "App",
  components: {
    iHeader,
    iFooter,
  },
  setup() {
    const store = useStore();
    onMounted(() => store.dispatch("init"));
  },
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  min-width: 800px;
  color: #444;
}
* {
  box-sizing: border-box;
}
#app {
  margin: 0;
  height: 100%;
  --sidebar-width: 120px;
  @media (min-width: 1100px) {
    & {
      --sidebar-width: 320px;
    }
  }
}
.padded-section {
  padding: 60px 0;
}
iframe {
  width: 100%;
  height: 100%;
}

@import "./style.css";
</style>
