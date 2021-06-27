<template>
  <el-dialog
    title="Размещение токенов"
    :model-value="shown"
    @update:model-value="(v) => $emit('update:close', v)"
  >
    <div class="text-center">
      <img src="/assets/icons/nft.png" width="96" />
      <img src="/assets/icons/right-arrow.svg" width="42" style="margin:0 1em;" />
      <img src="/assets/icons/blockchain.svg" width="96" />
    </div>
    <br />
    <el-form ref="formEl" :model="form" label-width="150px" :rules="formRules">
      <el-form-item label="NFT">
        <el-input :disabled="true" :model-value="modelValue.name"></el-input>
      </el-form-item>
      <el-form-item label="Кошелек">
        <el-input :disabled="true" :model-value="$store.state.wallet"></el-input>
      </el-form-item>
      <el-form-item label="Стоимость" prop="name">
        <el-input-number v-model="price" :min="0.01" :step="0.01" :max="1000"></el-input-number>
      </el-form-item>

      <p style="max-width:50%;margin:0 auto;">
        <i class="fa fa-info-circle"></i> Размещение может занять время, для подтверждения транзакции в сети
        BlockChain
      </p>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:shown', false)">Отмена</el-button>
        <el-button type="primary" @click="submit">Разместить</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRef, watch } from "vue";
import { ElFormItemContext } from "element-plus/lib/el-form";
import { useStore } from "vuex";
import { NFT } from "@/types";
import imageUploader from "@/components/image-uploader.vue";
import axios from "axios";
export default defineComponent({
  components: { imageUploader },
  name: "NftDeploy",
  emits: ["update:modelValue", "update:shown"],
  props: {
    modelValue: {
      type: Object as PropType<NFT>,
      required: true,
    },
    shown: Boolean,
  },
  setup(props, { emit }) {
    const formEl = ref<ElFormItemContext>();
    const price = ref(0.01);
    const store = useStore();
    async function submit() {
      try {
        store.commit("nft/patch", { ...props.modelValue, deploying: true });
        emit("update:shown", false);
        const res = await axios.post("nft-deploy", {
          nftId: props.modelValue._id,
          wallet: store.state.wallet,
          price: price.value,
        });
        store.dispatch("nft/save", res.data);
      } catch (e) {
        alert('Ошибка при размещении')
        store.commit("nft/patch", { ...props.modelValue, deploying: false });
      }
    }
    return { submit, formEl, price };
  },
});
</script>
/
