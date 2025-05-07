<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">Fe-C 钢热处理模拟</h1>

    <div class="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <label class="block text-gray-700 font-medium">
        温度 (K):
        <input type="number" v-model="temperature" class="input mt-1" />
      </label>

      <label class="block text-gray-700 font-medium">
        碳含量 (wt%):
        <input type="number" v-model="compositionC" step="0.01" class="input mt-1" />
      </label>

      <div class="text-sm text-gray-500">
        支持 Fe-C 基合金，未来可扩展到 Cr, Mn, Ni 等多元素。
      </div>

      <button @click="simulate" class="btn" :disabled="loading">
        {{ loading ? '计算中...' : '开始模拟' }}
      </button>
    </div>

    <div v-if="phases" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">计算结果</h2>
      <ul class="list-disc pl-6 text-gray-600">
        <li v-for="(val, key) in phases" :key="key">
          {{ key }}: {{ val }}
        </li>
      </ul>
      <button @click="explain" class="btn mt-4" :disabled="loadingExplain">
        {{ loadingExplain ? '解析中...' : '让智能体解释' }}
      </button>
    </div>

    <div v-if="explanation" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">智能体解析</h2>
      <pre class="bg-gray-100 p-4 rounded-md text-gray-600 whitespace-pre-wrap">{{ explanation }}</pre>
    </div>

    <div class="mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-700 mb-4">Fe-C 相图</h2>
      <button @click="loadPhaseDiagram" class="btn mb-4">生成相图</button>
      <div v-if="phaseDiagramUrl">
        <img :src="phaseDiagramUrl" alt="Fe-C Phase Diagram" class="rounded-lg shadow" />
      </div>
    </div>

    <div v-if="error" class="mt-4 text-red-600 font-semibold">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const temperature = ref(1300)
const compositionC = ref(0.4)
const phases = ref(null)
const explanation = ref('')
const loading = ref(false)
const loadingExplain = ref(false)
const error = ref('')
const phaseDiagramUrl = ref('')

const simulate = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await axios.post('http://localhost:8000/heat-treatment', {
      temperature: temperature.value,
      composition_c: compositionC.value
    })
    phases.value = res.data.phases
    explanation.value = ''
  } catch (err) {
    error.value = '计算失败，请检查服务器或输入值。'
  } finally {
    loading.value = false
  }
}

const explain = async () => {
  error.value = ''
  loadingExplain.value = true
  try {
    const res = await axios.post('http://localhost:8000/explain', {
      temperature: temperature.value,
      phase_info: phases.value
    })
    explanation.value = res.data.explanation
  } catch (err) {
    error.value = '解释失败，请检查 GPT 接口或网络连接。'
  } finally {
    loadingExplain.value = false
  }
}

const loadPhaseDiagram = async () => {
  error.value = ''
  try {
    const res = await axios.get('http://localhost:8000/phase-diagram')
    phaseDiagramUrl.value = 'data:image/png;base64,' + res.data.image
  } catch (err) {
    error.value = '相图生成失败，请检查服务器状态。'
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 0.5rem;
  width: 100%;
  font-size: 1rem;
  color: #333;
}
.btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
}
.btn:hover {
  background-color: #2563eb;
}
.btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>
