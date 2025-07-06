<template>
  <div>
    <h2>预测结果表格</h2>
    <button @click="exportToCSV">下载 CSV</button>

    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Rank</th>
          <th v-for="(key, i) in displayKeys" :key="i">{{ key }}</th>
          <th>Tg</th>
          <th>Score</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in predictions" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td v-for="key in displayKeys" :key="key">
            {{ formatNumber(item[key]) }}
          </td>
          <td>{{ formatNumber(item.Tg) }}</td>
          <td>{{ formatNumber(item.score) }}</td>
          <td>
            <button @click="toggleDetails(idx)">
              {{ showDetails[idx] ? '收起' : '打开' }}
            </button>
          </td>
        </tr>
        <tr v-if="showDetails[idx]" v-for="(item, idx) in predictions" :key="'details-' + idx">
          <td colspan="100%">
            <div style="white-space: pre-wrap">
              <strong>全部元素:</strong>
              <br />
              <span v-for="(val, key) in item" :key="key">
                <template v-if="!['score', 'Tg'].includes(key)">
                  {{ key }}: {{ formatNumber(val) }}
                  <br />
                </template>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue'
import { saveAs } from 'file-saver'

export default {
  name: 'PredictionTable',
  props: {
    predictions: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const showDetails = ref(Array(props.predictions.length).fill(false))

    const displayKeys = Object.keys(props.predictions[0] || {})
      .filter(k => !['score', 'Tg'])
      .slice(0, 5) // 只展示前5个元素

    const toggleDetails = (index) => {
      showDetails.value[index] = !showDetails.value[index]
    }

    const formatNumber = (val) => {
      return typeof val === 'number' ? val.toFixed(6) : val
    }

    const exportToCSV = () => {
      const rows = [
        Object.keys(props.predictions[0]).join(','),
        ...props.predictions.map(item =>
          Object.values(item).join(',')
        )
      ]
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'predictions.csv')
    }

    return {
      showDetails,
      toggleDetails,
      displayKeys,
      formatNumber,
      exportToCSV
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
}
th {
  background-color: #f0f0f0;
}
button {
  margin: 4px;
  padding: 4px 8px;
  cursor: pointer;
}
</style>
