<template>
  <el-dialog
    :title="modelValue._id ? 'Редактор коллекции' : 'Создайте свою коллекцию'"
    :model-value="shown"
    @update:model-value="(v) => $emit('update:close', v)"
    width="420px"
  >
    <el-form ref="formEl" :model="form" label-width="120px" :rules="formRules">
      <el-form-item label="Логотип">
        <image-uploader v-model="form.image" />
      </el-form-item>
      <el-form-item label="Имя" prop="name">
        <el-input v-model="form.name" placeholder="Введите имя коллекции"></el-input>
      </el-form-item>
      <el-form-item label="Описание" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          placeholder="Введите описание коллекции"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:shown', false)">Отмена</el-button>
        <el-button type="primary" @click="submit">{{ modelValue._id ? "Сохранить" : "Создать" }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
const df = {
  image: "",
  name: "",
  description: "",
};

const formRules = {
  name: [
    { required: true, message: "Требуется имя коллекции" },
    {
      min: 2,
      max: 26,
      message: "Имя должно быть от 2 до 26 символов",
    },
  ],
  description: [
    { required: true, message: "Требуется описание" },
    {
      min: 4,
      max: 1000,
      message: "Описание должно быть от 4 до 1000 символов",
    },
  ],
};
import { defineComponent, PropType, ref, toRef, watch } from "vue";
import { ElFormItemContext } from "element-plus/lib/el-form";
import { useStore } from "vuex";
import { Collection } from "@/types";
import imageUploader from "@/components/image-uploader.vue";
export default defineComponent({
  components: { imageUploader },
  name: "CollectionEdit",
  emits: ["update:modelValue", "update:shown"],
  props: {
    modelValue: {
      type: Object as PropType<Collection>,
      default: () => df,
    },
    shown: Boolean,
  },
  setup(props, { emit }) {
    const formEl = ref<ElFormItemContext>();
    const form = ref(df);
    const store = useStore();
    watch(toRef(props, "shown"), (nw) => {
      if (nw) {
        console.log("x");
        form.value = props.modelValue;
      }
    });
    function submit() {
      // form validate
      formEl.value?.validate((valid?: boolean) => {
        if (!valid) return false;
        // validated
        store.dispatch("collections/save", form.value);
        emit("update:shown", false);
        //form.value = df;
      });
    }
    return { submit, form, formEl, formRules };
  },
});
</script>
