<template>
  <div class="Stats">
    <iframe src="https://rinkeby.etherscan.io/tokentxns-nft" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Stats",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped lang="scss">
.Stats {
  height: calc(100% - 445px);
}
</style>
