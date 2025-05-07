<template>
  <div class="home-page-container">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">
        欢迎使用钢铁行业智能问答系统
      </h1>
      <p class="text-gray-600 mb-6">
        本系统支持以下功能：
      </p>
      <ul class="list-disc pl-6 mb-12">
        <li>上传技术文档（PDF/图片）进行内容检索</li>
        <li>中英文混合问题智能分析</li>
        <li>多源数据交叉验证（工艺数据库+文献库）</li>
      </ul>
      <el-button
        type="primary"
        size="large"
        @click="$router.push('/qa')"
      >
        开始提问
      </el-button>
      <el-button
        type="primary"
        size="large"
        @click="$router.push('/sphase')"
      >
        相图计算
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.home-page-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
