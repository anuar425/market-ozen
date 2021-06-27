<template>
  <el-card :body-style="{ padding: '0px' }" class="collection-card">
    <div class="preview" :style="{ backgroundImage: modelValue.image && `url(${modelValue.image})` }">
      <svg width="4" height="3" />
    </div>
    <div style="padding: 14px">
      <h4>{{ modelValue.name }}</h4>
      <p>{{ modelValue.description }}</p>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "CollectionCard",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        image: "",
        name: "",
        description: "",
      }),
    },
  },
});
</script>

<style scoped lang="scss">
.collection-card {
  cursor: pointer;
  transition: 0.3s all ease;
  &:hover {
    transform: scale(1.1);
  }
  .preview {
    min-height: 320px;
    background-size: cover;
    background-position: center;
    background-image: url(/assets/img/placeholder.png);
    svg {
      width: 100%;
      height: auto;
    }
  }
}
</style>
