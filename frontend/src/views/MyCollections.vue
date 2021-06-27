<template>
  <div class="MyCollections">
    <div class="container padded-section">
      <h2>Мои Коллекции</h2>
      <p>
        Создавайте, храните и управляйте коллекциями уникальных NFT для совместного использования и продажи.
      </p>
      <el-button type="primary" @click="shown = !false">Создать коллекцию</el-button>
      <br />
      <br />
      <div class="collection-list">
        <collection-card
          v-for="collection in collections"
          :key="collection._id"
          :modelValue="collection"
          @click="$router.push(`/collection/${collection._id}`)"
        ></collection-card>
      </div>
    </div>
    <collection-edit :model-value="{}" v-model:shown="shown" />
  </div>
</template>

<script lang="ts">
import CollectionCard from "@/components/collection-card.vue";
import imageUploader from "@/components/image-uploader.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { authRequired } from "@/utils";
import { Collection } from "@/types";
import CollectionEdit from "./CollectionEdit.vue";
export default defineComponent({
  components: { imageUploader, CollectionCard, CollectionEdit },
  name: "MyCollections",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup() {
    const store = useStore();
    onMounted(() => authRequired());
    const collections = computed(() =>
      store.state.collections.list.filter((c: Collection) => c.owner === store.state.user?._id)
    );
    return { collections, shown: ref(false) };
  },
});
</script>

<style scoped lang="scss">
.MyCollections {
  min-height: 100%;
  .collection-list {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
