<template>
    <div class="container mx-auto p-6 max-w-4xl">
      <!-- 系统标题 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-8">
        🏭 钢铁行业智能问答系统
      </h1>
  
      <!-- 文件上传模块 -->
      <FileUpload @upload-success="handleUploadSuccess" />
  
      <!-- 文件预览区域 -->
      <ElCollapse 
        accordion 
        v-model:activeNames="filePreviewActiveNames"
        class="mt-6"
      >
        <ElCollapseItem 
          :title="uploadedFileName ? `文件预览：${uploadedFileName}` : '请上传文件'"
          name="file-preview"
        >
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">
                {{ uploadedFileName ? `文件预览：${uploadedFileName}` : '请上传文件' }}
              </span>
              <el-icon class="text-gray-500">
                <ArrowDown />
              </el-icon>
            </div>
          </template>
          <div v-if="isPDF">
            <canvas ref="pdfPreview" width="800" height="600"></canvas>
          </div>
          <div v-else-if="isImage">
            <img :src="previewContent" alt="Uploaded Image" class="max-w-full h-auto" />
          </div>
          <div v-else>
            <p class="text-red-500">不支持预览此文件类型</p>
          </div>
        </ElCollapseItem>
      </ElCollapse>
  
      <!-- 问答交互区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <!-- 输入框 -->
        <div class="flex gap-4 mb-6">
          <el-input
            v-model="query"
            placeholder="请输入您的问题，例如：如何优化高炉温度？"
            size="large"
            :disabled="isLoading"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
  
          <!-- 修改后的开关组件，增强标识 -->
      <div class="flex items-center"> <!-- 添加 flex 容器包裹开关和说明 -->
        <el-switch
          v-model="searchDb"
          active-color="#13ce66"
          inactive-color="#ff4949"
          size="small"
          :disabled="isLoading"
          class="mr-2"  
        />
        <!-- 新增说明文字，使用更明确的描述 -->
        <span class="text-sm text-gray-600">
          <strong>搜索数据库</strong> <!-- 加粗标题增强识别 -->
          <span class="ml-1 text-xs">（开启后将同时查询历史数据库）</span> <!-- 补充说明 -->
        </span>
      </div>
  
          <el-button
            type="primary"
            size="large"
            :loading="isLoading"
            @click="handleSearch"
          >
            {{ isLoading ? '思考中...' : '开始提问' }}
          </el-button>
        </div>
  
        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center py-4">
          <el-progress
            :percentage="progress"
            :indeterminate="true"
            status="success"
          />
          <p class="mt-2 text-gray-500">正在分析问题，请稍候...</p>
        </div>
  
        <!-- 答案展示 -->
        <AnswerDisplay
          v-if="answer"
          :content="answer"
          @copy="handleCopyAnswer"
        />
  
        <!-- 错误提示 -->
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          closable
          class="mt-4"
        />
      </div>
  
      <!-- 参考资料 -->
    <div v-if="references.length > 0" class="mt-8">
    <h3 class="text-lg font-semibold mb-4">📚 参考资料</h3>
    <el-collapse v-model="activeReferences" accordion>
      <el-collapse-item 
        v-for="(reference, index) in references" 
        :key="index" 
        :name="index"
        class="reference-item"
      >
        <!-- 标题区域 -->
        <template #title>
          <div class="reference-header">
            <el-icon class="document-icon"><Document /></el-icon>
            <div class="flex flex-col">
              <span class="filename font-medium">{{ reference.source }}</span>
            </div>
          </div>
        </template>
  
        <!-- 内容区域 -->
        <div class="reference-content">
          <div class="content-box">
            <pre class="text-sm leading-6">{{ reference.text }}</pre>
          </div>
          <div class="meta-info mt-3">
            <el-tag type="info" size="small">文档片段</el-tag>
            <el-button 
              size="small" 
              class="ml-2"
              @click.stop="handleCopyText(reference.text)"
            >
              复制内容
            </el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  
      <!-- 历史记录 -->
      <div v-if="history.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold mb-4">📚 历史问答</h3>
        <div
          v-for="(item, index) in history"
          :key="index"
          class="bg-gray-50 p-4 rounded mb-3"
        >
          <p class="font-medium text-blue-600">Q: {{ item.query }}</p>
          <p class="mt-1 text-gray-700">A: {{ item.answer }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed ,onMounted} from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { useSteelStore } from '@/stores/useSteelStore'
  import { askQuestion, checkTaskStatus } from '@/api/steelApi'
  import AnswerDisplay from '@/components/AnswerDisplay.vue'
  import FileUpload from '@/components/FileUpload.vue'
  import { ElMessage } from 'element-plus'
  import * as pdfjsLib from 'pdfjs-dist';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import { Document } from '@element-plus/icons-vue'
  
  // 加载 pdf.js 的 worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/build/pdf.worker.min.mjs';
  
  const store = useSteelStore()
  const query = ref('')
  const searchDb = ref(false)
  const uploadedFileName = ref('')
  const previewContent = ref('');
  const isPDF = ref(false);
  const isImage = ref(false);
  const pdfPreview = ref<HTMLCanvasElement | null>(null);
  
  // 计算属性
  const isLoading = computed(() => store.isLoading)
  const answer = computed(() => store.answer)
  const history = computed(() => store.history)
  const errorMessage = computed(() => store.errorMessage)
  const progress = computed(() => store.uploadProgress)
  const references = ref<any[]>([]);
  const activeReferences = ref<number[]>([]) // 当前展开的参考资料项
    const filePreviewActiveNames = ref<string[]>([]);// 当前展开的文件预览项
  
  // 处理搜索
  const handleSearch = async () => {
  
    if (!query.value.trim()) {
      store.errorMessage = '问题不能为空'
      return
    }
  
    try {
      store.isLoading = true
      const {data} = await askQuestion({
        question: query.value,
        searchDb: searchDb.value,
        filename: uploadedFileName.value
      })
      //const taskId = response.data.task_id
      console.log('完整响应数据:', data)
      if (data.error) {
        store.errorMessage = data.error
        store.isLoading = false
        return
      }
  
      store.answer = data.answer
      references.value = data.references || []
  
      console.log('答案:', data.answer)
      console.log('参考资料:', references.value)
      // 将答案和参考资料存储到状态管理中
  
      store.history.unshift({
        query: query.value,
        answer: data.answer
      })
      query.value = ''
      store.isLoading = false
  
      /* 轮询任务状态
      const interval = setInterval(async () => {
        const statusRes = await checkTaskStatus(taskId)
        if (statusRes.data.status === 'SUCCESS') {
          clearInterval(interval)
          store.answer = statusRes.data.result
          store.history.unshift({
            query: query.value,
            answer: statusRes.data.result
          })
          query.value = ''
          store.isLoading = false
        } else if (statusRes.data.status === 'FAILURE') {
          clearInterval(interval)
          store.errorMessage = '模型处理失败，请重试'
          store.isLoading = false
        }
      }, 1000)*/
    } catch (error) {
      store.errorMessage = '请求失败，请检查网络连接'
      store.isLoading = false
    }
  }
  
  // 处理上传成功
  const handleUploadSuccess = (fileid: string,arrayBuffer: ArrayBuffer) => {
    ElMessage.success({
      message: `文件上传成功！文ID: ${fileid}`,
      duration: 3000
    })
    uploadedFileName.value = fileid
    isPDF.value = true;
    isImage.value = false;
    previewContent.value = ''; // 重置图片预览内容（如果有的话）
    // 调用 renderPDF 并传入 canvas ref
    renderPDF(arrayBuffer); // 显式传递 canvas 元素
  }
  
  // 处理文件预览
  
  // 渲染 PDF
  const renderPDF = async (arrayBuffer: ArrayBuffer) => {
    try {
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdfDoc.getPage(1);
  
      const renderPage = async () => {
        const canvas = pdfPreview.value;
        if (!canvas) {
          console.error('无法获取 canvas 元素');
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('无法获取 canvas 的 2D 上下文');
          return;
        }
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      };
  
      renderPage();
    } catch (error) {
      console.error('获取 PDF 文档失败:', error);
    }
  };
  
  // 新增复制方法(参考资料)
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    ElMessage.success('内容已复制')
  }
  
  // 复制答案
  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(store.answer)
    ElMessage.success('答案已复制到剪贴板')
  }
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    background: #f8fafc;
  }
  
  :deep(.el-input__inner) {
    border-radius: 12px;
    padding: 1rem 1.5rem;
  }
  
  .reference-item {
    margin-bottom: 8px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    background: white;
    overflow: hidden;
  }
  
  /* 标题区域 */
  .reference-header {
    display: flex;
    align-items: center;
    padding: 12px;
    background: var(--el-color-primary-light-9);
    transition: all 0.3s;
    .document-icon {
      color: var(--el-color-primary);
      font-size: 20px;
      margin-right: 12px;
    }
    &:hover {
      background: var(--el-color-primary-light-8);
    }
  }
  
  /* 内容区域 */
  .reference-content {
    padding: 16px;
    border-top: 1px dashed var(--el-border-color);
    .content-box {
      max-height: 300px;
      overflow: auto;
      padding: 12px;
      background: #f8fafc;
      border-radius: 4px;
      pre {
        white-space: pre-wrap;
        font-family: 'Courier New', monospace;
      }
    }
    .meta-info {
      display: flex;
      align-items: center;
      margin-top: 12px;
    }
  }
  
  /* 折叠组件样式 */
  .el-collapse {
    --el-collapse-item-border: none;
  }
  
  /* 覆盖Element Plus默认样式 */
  :deep(.el-collapse-item__header) {
    border: none !important;
    background: transparent !important;
    height: auto !important;
  }
  :deep(.el-collapse-item__wrap) {
    border: none !important;
  }
  </style>