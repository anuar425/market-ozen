<template>
  <el-upload
    class="image-uploader"
    accept="image/jpeg"
    action="/api/upload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <div v-if="modelValue" :style="{ backgroundImage: `url(${modelValue})` }" class="image"></div>
    <i v-else class="el-icon-picture image-uploader-icon"></i>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImageUploader",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup(_, { emit }) {
    function beforeUpload(fileUrl: string) {
      console.log(fileUrl);
    }
    function handleSuccess(fileUrl: string) {
      emit("update:modelValue", fileUrl);
    }
    return { handleSuccess, beforeUpload };
  },
});
</script>

<style lang="scss">
.image-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .image {
    width: 178px;
    height: 178px;
    display: block;
    background-size:cover;
    background-position:center;
  }
}
</style>
