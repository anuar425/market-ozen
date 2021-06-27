<template>
  <el-header class="iHeader">
    <div class="logo-group" @click="$router.push('/')">
      <div class="logo"><svg width="1" height="1"></svg></div>
      &nbsp;&nbsp;
      <div class="name">Ozen</div>
    </div>

    <div style="flex-grow: 1">
      <el-input placeholder="Поиск работ, коллекций и пользователей" v-model="search" @keydown.enter="goSearch">
        <template #prefix>
          <i class="el-input__icon el-icon-search"></i>
        </template>
      </el-input>
    </div>
    <div class="nav">
      <el-dropdown v-for="(menu, midx) in menuMap" :key="midx">
        <span class="el-dropdown-link">
          <el-button type="text">{{ menu.name }}</el-button>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :index="'1-' + (idx + 1)"
              v-for="(cat, idx) in menu.items"
              :key="idx"
              @click="$router.push(cat.path)"
              ><i class="fa-fw fa" :class="`fa-${cat.icon}`"></i> {{ cat.name }}</el-dropdown-item
            >
            <div class="socials" v-if="midx === 2">
              <a target="_blank" href="https://sergazin.kz" class="fab fa-twitter"></a>
              <a target="_blank" href="https://instagram.com/armaneden" class="fab fa-instagram"></a>
              <a target="_blank" href="https://sergazin.kz" class="fab fa-facebook"></a>
              <a target="_blank" href="https://sergazin.kz" class="fab fa-discord"></a>
              <a target="_blank" href="https://telegram.me/sergazin" class="fab fa-telegram"></a>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-divider direction="vertical"></el-divider>

      <el-dropdown v-if="user">
        <span class="el-dropdown-link" style="display:flex;align-items:center;">
          <el-avatar :size="32" icon="el-icon-user-solid" :src="user.info.avatar" style="cursor: pointer">
          </el-avatar
          >&nbsp;&nbsp;
          <div>
            <div>{{ user.login }}</div>
            <div
              style="max-width:100px;text-overflow: ellipsis;overflow:hidden;"
              v-if="$store.state.wallet"
              :title="$store.state.wallet"
            >
              {{ $store.state.wallet }}
            </div>
            <div v-else>Кошелек не подключен</div>
          </div>

          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <div v-if="$store.state.wallet" style="width:200px;padding:0 20px;" index="2-1">
              <i class="fa-fw fab fa-ethereum"></i> Адрес кошелька: {{ $store.state.wallet }}
            </div>
            <el-dropdown-item index="2-1" v-else @click="$router.push('/connect-wallet')"
              ><i class="fa-fw fab fa-ethereum"></i> Подключить кошелек</el-dropdown-item
            >
            <!-- 
            <el-dropdown-item index="2-1"><i class="fa-fw fa fa-star"></i> Мой профиль</el-dropdown-item>
               -->
            <el-dropdown-item index="2-2" @click="$router.push('/collections')"
              ><i class="fa-fw fa fa-chart-line"></i> Мои коллекции</el-dropdown-item
            >
            <el-dropdown-item index="2-2" @click="signOut()"
              ><i class="fa-fw fa fa-sign-out"></i> Выход</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-else>
        <el-button type="text" @click="$router.push('/login')"
          ><i class="fa-fw fa fa-sign-in" style="font-size:22px"></i>&nbsp;
          <span style="display:inline-block;vertical-align:top;line-height:22px">Войти</span></el-button
        >
      </div>
    </div>
    <!-- 
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Marketplace</el-menu-item>
      <el-submenu index="2">
        <template #title></template>
        <el-menu-item >{{
          cat.name
        }}</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" disabled>Info</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
    </el-menu>
       -->
  </el-header>
  <div class="dummy"></div>
</template>

<script lang="ts">
import axios from "axios";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export const menuMap = [
  {
    name: "Маркетплейс",
    items: [
      { name: "Все NFT", icon: "th", path: "/marketplace" },
      { name: "Илюстрации", icon: "image", path: "/marketplace/pics" },
      { name: "Музыка", icon: "music", path: "/marketplace/music" },
      { name: "Доменные имена", icon: "globe", path: "/marketplace/domains" },
      { name: "Коллекции", icon: "copy", path: "/marketplace/collections" },
    ],
  },
  {
    name: "Статистика",
    items: [
      { name: "Рейтинги", icon: "star", path: "/stats" },
      { name: "Активность", icon: "chart-line", path: "/stats" },
    ],
  },
  {
    name: "Справка",
    items: [
      { name: "Справочный центр", icon: "life-ring", path: "/about" },
      { name: "Партнерам и разработчикам", icon: "code", path: "/about" },
      { name: "Пожелания", icon: "thumbs-up", path: "/about" },
      { name: "Блог", icon: "info", path: "/about" },
      { name: "Новости", icon: "newspaper", path: "/about" },
    ],
  },
];
export default defineComponent({
  name: "Header",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    const search = ref("");
    const store = useStore();
    const user = computed(() => store.state.user);
    const router = useRouter();
    async function signOut() {
      await axios.post("auth/logout");
      store.commit("loadState", { user: null });
      router.push("/");
    }
    function goSearch() {
      if (search.value) router.push({ query: { q: search.value }, path: "/marketplace" });
      else router.push({ path: "/marketplace" });
    }
    return {
      user,
      goSearch,
      search,
      menuMap,
      signOut,
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
});
</script>

<style scoped lang="scss">
.dummy {
  height: 60px;
}
.iHeader {
  display: flex;
  border-bottom: 1px solid lightgray;
  padding: 0.8em 1.5em;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 100;
  background: white;

  .logo-group {
    width: var(--sidebar-width);
    height: 100%;
    align-items: center;
    display: flex;
    cursor: pointer;
    @media (max-width: 900px) {
      width: auto;
      .name {
        display: none;
      }
    }
    .logo {
      background-image: url(/assets/logo.svg);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      height: 100%;
      svg {
        width: auto;
        height: 100%;
      }
    }
    .name {
      font-size: 1.3em;
    }
  }
  .nav {
    display: flex;
    margin-left: 1em;
    align-items: center;
    justify-content: flex-end;
    gap: 1em;
    .el-button--text {
      color: black;
    }
  }
}
.socials {
  display: flex;
  gap: 0.5em;
  justify-content: space-between;
  padding: 1em 2em;

  .fab {
    cursor: pointer;
    font-size: 2em;
    transition: 0.3s all ease;
    &:hover {
      opacity: 0.7;
    }
  }
  a {
    color: black;
    text-decoration: none;
  }
}
</style>
