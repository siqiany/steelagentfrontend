<template>
    <el-card shadow="always" class="upload-box">
      <el-upload
        drag
        action=""
        class="upload-wrapper"
        :before-upload="beforeUpload"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
          <div class="el-upload__tip">
            支持PDF格式，单文件不超过50MB
          </div>
        </div>
        <template #tip>
          <div v-if="progress > 0" class="progress-bar">
            <el-progress 
              :percentage="progress"
              :stroke-width="18"
              status="success"
            />
          </div>
        </template>
    </el-upload>
  </el-card>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { UploadFilled } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useSteelStore } from '@/stores/useSteelStore'
  import { uploadFile } from '@/api/steelApi';
  
  const store = useSteelStore()
  const progress = ref(0)
  const isUploading = ref(false)
  const emit = defineEmits(['upload-success'])  // 获取正确的 emit 函数
  
  const beforeUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过50MB')
      return false
    }
    if (file.type !== 'application/pdf') {
      ElMessage.error('仅支持PDF格式文件')
      return false
    }
    isUploading.value = true
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      await new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
    });
    const arrayBuffer = reader.result as ArrayBuffer;
    const response = await uploadFile(file);  // 调用 uploadFile 函数
    handleSuccess(response,arrayBuffer);  // 处理上传成功的响应
    } catch (error) {
      handleError();  // 处理上传失败的情况
    }
    return false;  // 阻止 el-upload 的默认上传行为
  }
  
  const handleProgress = (event: ProgressEvent) => {
    progress.value = Math.round((event.loaded / event.total) * 100)
  }
  
  const handleSuccess = (response: any, arrayBuffer: ArrayBuffer) => {
  isUploading.value = false
  progress.value = 0
  console.log('上传成功:', response.data.fileid)
  emit('upload-success', response.data.fileid, arrayBuffer);  // 触发 upload-success 事件，传递 fileid 和 arrayBuffer
}
  
  const handleError = () => {
    isUploading.value = false
    progress.value = 0
    ElMessage.error('文件上传失败，请重试')
  }
</script>
  
  <style scoped>
    .upload-box {
    border: 2px dashed #e4e7ed;
    border-radius: 8px;
    }

    .upload-wrapper {
    padding: 20px;
    }

  </style>