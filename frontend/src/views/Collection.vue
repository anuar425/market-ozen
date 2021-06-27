<template>
  <div class="Collection">
    <div
      class="background"
      :style="{ backgroundImage: `url(${collection.image || '/assets/img/background.jpg'})` }"
    ></div>
    <div class="text-center">
      <el-avatar
        :size="128"
        :src="collection.image"
        icon="el-icon-picture-outline"
        style="cursor: pointer;font-size:52px;margin-top:-64px;z-index:9;"
        fit="cover"
      >
      </el-avatar
      >&nbsp;&nbsp;
      <h2>{{ collection.name }}</h2>
      <div class="controls" v-if="collection.owner === $store.state.user?._id">
        <el-button type="primary" @click="shown = true"><i class="fa fa-cog"></i> Настройка</el-button>
        <el-button type="success" @click="shownNft = true"><i class="fa fa-plus"></i> Создать NFT</el-button>
        <br />
        <br />
      </div>
      <p style="white-space:pre">{{ collection.description }}</p>
    </div>

    <div class="nft-list container">
      <nft-card :model-value="nft" v-for="nft in nftList" :key="nft._id" />
    </div>
    <collection-edit :model-value="collection" v-model:shown="shown" />
    <nft-edit v-model:shown="shownNft" :model-value="{ collectionId: collection._id }" />
    <br />
    <br />
    <br />
    <br />
  </div>
</template>

<script lang="ts">
import NftCard from "@/components/nft-card.vue";
import { Collection, NFT } from "@/types";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import CollectionEdit from "./CollectionEdit.vue";
import NftEdit from "./NftEdit.vue";
export default defineComponent({
  components: { CollectionEdit, NftEdit, NftCard },
  name: "Collection",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  setup() {
    const route = useRoute();
    const store = useStore();
    const collection = computed(() =>
      store.state.collections.list.find((c: Collection) => c._id === route.params.id)
    );
    const shown = ref(false);
    const shownNft = ref(false);
    const nftList = computed(() =>
      store.state.nft.list.filter((nft: NFT) => nft.collectionId === route.params.id)
    );
    return { collection, shown, shownNft, nftList };
    //const collection
  },
});
</script>

<style scoped lang="scss">
.Collection {
  .background {
    filter: blur(8px);
    height: 280px;
    width: 100%;
    opacity: 0.7;
    z-index: 1;
    -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
  }
  .nft-list {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
