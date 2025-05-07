import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSteelStore = defineStore('steel', () => {
  const uploadProgress = ref(0)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const answer = ref('')
  const history = ref<Array<{ query: string; answer: string }>>([])

  const resetState = () => {
    uploadProgress.value = 0
    isLoading.value = false
    errorMessage.value = ''
  }

  return {
    uploadProgress,
    isLoading,
    errorMessage,
    answer,
    history,
    resetState
  }
})