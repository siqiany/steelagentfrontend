import axios from 'axios'
import { unref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const steelApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
})

interface SearchParams {
  question: string;
  searchDb?: boolean;
  filename?: string;
}

// 文件上传接口
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file)
  try{
    return steelApi.post('/api/upload', formData,)
  }catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

// 智能问答接口
export const askQuestion = async (params: SearchParams) => {
  const { question, searchDb = false, filename = '' } = params;
  console.log('发送的请求体:', { question:question, searchDb, filename });
  return steelApi.post('/api/search', { question:question, searchDb, filename }, )
}

// 任务状态查询接口
export const checkTaskStatus = async (taskId: string) => {
  return steelApi.get(`/api/task/${taskId}`)
}