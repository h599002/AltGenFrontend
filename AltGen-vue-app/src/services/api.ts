import axios, { AxiosError } from 'axios';

// Use environment variable for API URL if available, otherwise use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7860';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces for aircraft classification
export interface ClassifyAircraftRequest {
  imageUrl: string;
  model?: string;
  prompt?: string;
  temperature?: number;
}

export interface ClassifyAircraftResponse {
  aircraft: string;
  confidence: number;
}

interface GradioResponse<T> {
  data: T[];
}

interface ErrorResponse {
  message: string;
}

// API endpoints grouped by service
export const googleApi = {
};

export const replicateApi = {
  // Add your replicate endpoints here
};

export const llmApi = {
  // Add your LLM endpoints here
};

export const cnnApi = {
  analyzeImage: (imageUrl: string) => 
    api.post(`/api/cnn-llm/predict`, null, { params: { imageUrl } }),
};

   /* const response = await api.post('/api/cnn-llm/predict',payload);
    
    return {
      aircraft: response.data.Aircraft,
      confidence: response.data.Confidence
    };
};*/

export default api; 