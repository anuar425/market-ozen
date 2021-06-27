<template>
  <div class="Landing">
    <section id="s-1" v-if="nftList.length">
      <div class="background" :style="{ backgroundImage: `url(${nftList[0].image})` }"></div>
      <div class="container">
        <el-row>
          <el-col :md="12" :xs="24">
            <div class="pane">
              <h2 style="font-weight: bold">Изучайте, собирайте и продавайте необычные NFT</h2>
              <h3>на первом и крупнейшем в СНГ рынке NFT</h3>
              <div class="buttons">
                <el-button type="primary" @click="$router.push('/marketplace')">Найти</el-button>
                <el-button type="primary" plain @click="$router.push('/collections')">Создать</el-button>
              </div>
            </div>
          </el-col>
          <el-col :md="12" :xs="24">
            <div class="pane">
              <nft-card :model-value="nftList[0]" />
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <section id="s-2">
      <div class="container">
        <h3 class="text-center">Эксклюзивный контент</h3>
        <br />
        <el-carousel :interval="4000" type="card">
          <el-carousel-item v-for="nft in nftList.slice(0, 9)" :key="nft._id">
            <nft-card :model-value="nft" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    <section id="s-1-5" class="padded text-center" style="background:#f5f5f5a1">
      <div class="container">
        <h2>
          Создавайте и продавайте свои NFT
        </h2>
        <br />
        <br />
        <el-row :gutter="60">
          <el-col :md="6" :sm="12" v-for="(adv, idx) in advantages" :key="idx">
            <img :src="`/assets/icons/${adv.icon}.svg`" width="53" />
            <div class="title" style="margin:10px 0;">
              <b style="width:160px;display:inline-block;">{{ adv.title }}</b>
            </div>
            <p style="font-size:0.86em">{{ adv.text }}</p>
          </el-col>
        </el-row>
      </div>
    </section>
    <section id="s-2">
      <div class="container">
        <h3 class="text-center">Много авторских работ</h3>
        <br />
        <el-carousel :interval="4000" type="card">
          <el-carousel-item v-for="nft in nftList.slice(10, 19)" :key="nft._id">
            <nft-card :model-value="nft" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import nftCard from "@/components/nft-card.vue";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
const advantages = [
  {
    icon: "wallet",
    title: "Настройте свой кошелек",
    text:
      "Как только вы настроите свой кошелек по своему выбору, подключите его к Ozen, щелкнув значок кошелька в правом верхнем углу. Узнайте о кошельках, которые мы поддерживаем.",
  },
  {
    icon: "collection",
    title: "Создайте свою коллекцию",
    text:
      "Нажмите кнопку Создать и настройте свою коллекцию. Добавьте социальные ссылки, описание, изображения профиля и баннеров и установите плату за вторичные продажи.",
  },
  {
    icon: "picture",
    title: "Добавьте свои NFT",
    text:
      "Загрузите свою работу (изображение, видео, аудио или 3D-изображение), добавьте заголовок и описание и настройте свои NFT с помощью свойств, статистики и открываемого контента.",
  },
  {
    icon: "tag",
    title: "Выставьте их на продажу",
    text:
      "Выбирайте между аукционами, объявлениями с фиксированной ценой и объявлениями со снижающейся ценой. Вы выбираете, как вы хотите продавать свои NFT, и мы помогаем вам продавать их!",
  },
];
export default defineComponent({
  components: { nftCard },
  name: "Landing",
  setup() {
    const store = useStore();
    const nftList = computed(() => store.state.nft.list.sort(() => 0.5 - Math.random()));
    return { nftList, advantages };
  },
});
</script>

<style scoped lang="scss">
.Landing {
  section {
    padding: 60px 0;
  }
  #s-1 {
    padding-top: 0;
    position: relative;
    .background {
      background-size: cover;
      background-position: center;
      filter: blur(8px);
      height: 100%;
      width: 100%;
      position: absolute;
      opacity: 0.7;
      -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
    }

    .pane {
      padding: 4em 2em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }
  }
  .nft {
    .preview {
      background-size: cover;
      background-position: center;
      svg {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
