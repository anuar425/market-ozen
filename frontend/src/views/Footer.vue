<template>
  <div class="Footer  padded">
    <div class="container">
      <el-row :gutter="40">
        <el-col :md="8" :sm="24" style="margin-bottom:2em">
          <div class="logo-group" @click="$router.push('/')">
            <div class="logo"><svg width="1" height="1"></svg></div>
            &nbsp;&nbsp;
            <div class="name">Ozen</div>
          </div>
          <div class="desc">
            Первый и крупнейший в СНГ цифровой рынок для коллекционирования криптовалют и несменяемых токенов
            (NFT). Покупайте, продавайте и открывайте для себя эксклюзивные цифровые активы.
          </div>
        </el-col>
        <el-col :md="16" :sm="24" style="line-height:2">
          <el-row :gutter="20">
            <el-col :md="8" :sm="8" :xs="24" v-for="(menu, idx) in menuMap" :key="idx">
              <div>
                <b>{{ menu.name }}</b>
              </div>
              <div
                class="menu-item"
                :index="'1-' + (idx + 1)"
                v-for="(cat, idx) in menu.items"
                :key="idx"
                @click="$router.push(cat.path)"
              >
                <i class="fa-fw fa" :class="`fa-${cat.icon}`"></i> {{ cat.name }}
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <hr />
      <el-row>
        <el-col>&copy; 2021 Sergazin Software</el-col>
        <el-col></el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { menuMap } from "./Header.vue";
export default defineComponent({
  name: "Footer",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    return { menuMap };
  },
});
</script>

<style scoped lang="scss">
.Footer {
  color: white;
  background: #0091ff;
  .logo-group {
    width: var(--sidebar-width);
    align-items: center;
    margin-bottom: 1em;
    display: flex;
    cursor: pointer;
    @media (max-width: 900px) {
      width: auto;
      .name {
        display: none;
      }
    }
    .logo {
      background-color: white;
      border-radius: 100%;
      padding: 1em;
      background-image: url(/assets/logo.svg);
      background-position: 60% 40%;
      background-repeat: no-repeat;
      background-size: 70%;
      height: 64px;
      svg {
        width: auto;
        height: 100%;
      }
    }
    .name {
      font-size: 1.7em;
    }
  }
  .menu-item {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
