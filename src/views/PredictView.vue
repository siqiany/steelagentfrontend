<template>
  <div class="container">
    <h2>玻璃材料性能逆向预测</h2>

    <form @submit.prevent="predict">
      <div class="form-group">
        <label>折射率：</label>
        <input type="number" v-model.number="refractiveIndex" step="0.001" required />
      </div>

      <div class="form-group">
        <label>阿贝值：</label>
        <input type="number" v-model.number="abbeNumber" step="0.01" required />
      </div>

      <div class="form-group">
        <label>平均色散：</label>
        <input type="number" v-model.number="meanDispersion" step="0.01" required />
      </div>

      <button type="submit">开始预测</button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <PredictionTable v-if="results.length > 0" :predictions="results" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import PredictionTable from '@/components/PredictionTable.vue'

const refractiveIndex = ref(1.5)
const abbeNumber = ref(60)
const meanDispersion = ref(0.02)

const results = ref([])
const error = ref('')

const predict = async () => {
  error.value = ''
  results.value = []
  try {
    const response = await axios.post('http://localhost:8000/predict', {
      conditions: [refractiveIndex.value, abbeNumber.value, meanDispersion.value]
    })
    results.value = response.data
  } catch (err) {
    console.error(err)
    error.value = '预测失败，请检查后端服务是否正常运行。'
  }
}
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: #fff;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
