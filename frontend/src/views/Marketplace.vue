<template>
  <div class="Marketplace padded">
    <div class="container">
      <h2>Маркетплейс NFT токенов</h2>
      <h4>Выберите лучшее для себя</h4>
      <br />
    </div>
    <hr />
    <br />
    <div class="nft-list container">
      <nft-card :model-value="nft" v-for="nft in nftList" :key="nft._id" />
    </div>
  </div>
</template>

<script lang="ts">
import nftCard from "@/components/nft-card.vue";
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { NFT } from "@/types";
import { useStore } from "vuex";
export default defineComponent({
  components: { nftCard },
  name: "Marketplace",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const search = computed(
      () => route.query.q && typeof route.query.q === "string" && route.query.q.toLowerCase()
    );
    const nftList = computed(() =>
      search.value && typeof search.value === "string"
        ? store.state.nft.list.filter((nft: NFT) => nft.name.toLowerCase().indexOf(search.value as string) !== -1)
        : store.state.nft.list.sort(() => 0.5 - Math.random())
    );
    return { nftList };
  },
});
</script>

<style scoped lang="scss">
.Marketplace {
  .nft-list {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
