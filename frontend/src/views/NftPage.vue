<template>
  <div class="NftPage padded">
    <div class="container">
      <el-row :gutter="40">
        <el-col :md="12" :sm="24">
          <el-card>
            <template #header>
              <div class="text-left">
                <div class="fav"><span class="fa fa-heart"></span> 0</div>
              </div>
            </template>

            <div class="text-center">
              <el-image :src="nft.image">
                <template #error>
                  <div class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </template>
              </el-image>
            </div>
          </el-card>
          <br />
          <el-card class="box-card">
            <template #header>
              <b>Описание</b>
            </template>
            {{ nft.description || "Описание отсудствует" }}
          </el-card>
        </el-col>
        <el-col :md="12" :sm="24">
          <div class="collection" @click="$router.push('/collection/' + nft.collectionId)">
            {{ collection.name }}
          </div>
          <div class="nft-name">{{ nft.name }}</div>
          <div class="display-flex">
            <div class="owned-by">
              <el-avatar icon="el-icon-user-solid"></el-avatar>&nbsp;&nbsp;
              <div class="owner-name">Владелец: {{ nft.owner.slice(0, 6).toUpperCase() }}</div>
            </div>
            <div class="views"><i class="fa fa-eye"></i>&nbsp;&nbsp;Просмотры: {{ nft.views || 0 }}</div>
          </div>
          <br /><br />
          <el-card class="box-card" v-if="nft.deploying">
            <!-- DEPLOYING! -->
            <template #header>
              <b>Размещение в процессе</b>
            </template>
            <el-progress :percentage="100" :indeterminate="true" :show-text="false" :duration="1"></el-progress>
            <br />
            <p>Производится размещение данного токена в BlockChain...</p>
          </el-card>
          <template v-else>
            <!-- DEPLOYED CONTRACT! -->
            <template v-if="nft.contractAddress">
              <el-card class="box-card">
                <template #header>
                  <b>Стоимость</b>
                </template>
                <div class="display-flex">
                  <el-avatar icon="fab fa-ethereum"></el-avatar
                  ><span class="price" style="font-size:1.4em"
                    >{{ nft.price || 0 }}
                    <span style="font-size:.7em"
                      >({{ nft.price ? Math.ceil(nft.price * 853071) : 0 }} тенге)</span
                    ></span
                  >
                </div>
                <br />
                <el-button type="primary"> <i class="fa shopping-cart"></i> Купить </el-button>
              </el-card>
              <br />
              <el-card class="box-card">
                <template #header>
                  <b>Информация в BlockChain</b>
                </template>
                Адрес контракта:
                <a target="_blank" :href="`https://rinkeby.etherscan.io/address/${nft.contractAddress}`">{{
                  nft.contractAddress
                }}</a>
                <br />
                <br />
                <a target="_blank" :href="`https://testnets.opensea.io/assets/${nft.contractAddress}/0`"
                  ><el-button type="primary">
                    <i class="fa shopping-cart"></i> Посмотреть на OpenSea
                  </el-button></a
                >
              </el-card>
            </template>
            <!-- NOT DEPLOYED CONTRACT! -->
            <el-card v-else>
              <template #header>
                <b>Токен не размещен в сети BlockChain</b>
              </template>
              <div class="own" v-if="$store.state.user && nft.owner === $store.state.user._id">
                <p>
                  Вы являетесь владельцем токена, но он пока не размещен в сети BlockChain. Чтобы сделать это -
                  кликните на кнопку Разместить
                </p>
                <el-button type="primary" @click="deploy">
                  <i class="fa shopping-cart"></i> Разместить в BlockChain
                </el-button>
              </div>
              <div v-else>
                <p>
                  Вы не являетесь владельцем токена. Владелец токена пока не разместил ее в сеть BlockChain.
                  Необходимо подождать.
                </p>
              </div>
            </el-card>
          </template>
        </el-col>
      </el-row>
    </div>
    <nft-deploy v-model:shown="shownDeploy" :model-value="nft" />
  </div>
</template>

<script lang="ts">
import { Collection, NFT } from "@/types";
import { ElMessageBox } from "element-plus";
import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import NftDeploy from "./NftDeploy.vue";
export default defineComponent({
  components: { NftDeploy },
  name: "NftPage",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const nft = computed(() => store.state.nft.list.find((c: NFT) => c._id === route.params.id));
    const collection = computed(() =>
      store.state.collections.list.find((c: Collection) => c._id === nft.value.collectionId)
    );
    const shownDeploy = ref(false);
    function deploy() {
      if (store.state.wallet) shownDeploy.value = true;
      else
        ElMessageBox.alert(
          "Чтобы разместит токен в сети, необходимо подключить криптовалютный кошелек",
          "Кошелек не подключен",
          {
            confirmButtonText: "Подключить",
            callback: () => {
              router.push("/connect-wallet");
            },
          }
        );
    }
    return { nft, collection, shownDeploy, deploy };
  },
});
</script>

<style scoped lang="scss">
.NftPage {
  .fav {
    cursor: pointer;
    transition: 0.3s all ease;
    display: inline-block;
    &:hover {
      color: red;
    }
  }
  .collection {
    color: blue;
    font-size: 1.4em;
    cursor: pointer;
  }
  .nft-name {
    font-size: 2em;
    margin: 1em 0 0.5em;
  }
  .owned-by {
    display: flex;
    align-items: center;
  }
}
</style>
