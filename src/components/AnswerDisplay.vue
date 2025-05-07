<template>
    <el-card class="answer-container">
      <template #header>
        <div class="header">
          <h3 class="title">📝 智能分析结果</h3>
          <el-button 
            type="info" 
            size="small" 
            @click="$emit('copy')"
          >
            复制答案
          </el-button>
        </div>
      </template>
      <div class="content">
        <pre v-html="renderedAnswer"></pre>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { computed ,ref} from 'vue'
  import { highlightKeywords } from '@/utils/helpers'
  import katex from 'katex'
  import 'katex/dist/katex.min.css'
  
  const props = defineProps<{
    content: string
  }>()
  
  const renderedAnswer = computed(() => {
  return props.content.replace(/\\\[(.*?)\\\]/gs, (_, latex) => {
    try {
      return katex.renderToString(latex, { throwOnError: false })
    } catch {
      return latex  // 渲染失败时显示原始代码
    }
  })
})
  </script>
  
  <style scoped>
  .answer-container {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 16px;
    background-color: #fafafa;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #606266;
  }
  
  .content pre {
    white-space: pre-wrap;
    font-family: monospace;
    color: #606266;
    line-height: 1.6;
  }
  
  .content .highlight {
    background-color: #fff6cc;
    padding: 0 4px;
    border-radius: 4px;
  }
  </style>
  