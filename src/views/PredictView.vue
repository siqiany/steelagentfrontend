<template>
    <div class="container">
      <h1>光学玻璃逆向预测</h1>
  
      <div class="form-group">
        <label for="ri">输入折射率 RI:</label>
        <input type="number" step="0.0001" v-model="ri" id="ri" />
        <button @click="predict">生成成分</button>
      </div>
  
      <div v-if="loading">正在预测...</div>
      <div v-else-if="error">{{ error }}</div>
  
    <table v-if="result.length > 0">
        <thead>
            <tr>
            <th v-for="(value, key) in result[0]" :key="key">{{ key }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, index) in result" :key="index">
            <td v-for="(value, key) in row" :key="key">{{ value.toFixed(2) }}</td>
            </tr>
        </tbody>
    </table>
    </div>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { fetchPredictedCompositions, type Composition } from '@/api/steelApi'
  
const ri = ref(1.52)
const result = ref<Composition[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const predict = async () => {
  loading.value = true
  error.value = null
  result.value = []

  try {
    result.value = await fetchPredictedCompositions(ri.value)
  } catch (err) {
    error.value = '预测失败，请检查后端服务或网络连接'
  } finally {
    loading.value = false
  }
}
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 40px auto;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  input {
    width: 120px;
    padding: 6px;
  }
  
  button {
    padding: 6px 12px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  </style>
  