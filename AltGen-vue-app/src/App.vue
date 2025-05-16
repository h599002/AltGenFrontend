
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-white">AltGen</h1>
    </div>
    </div>  
    <!-- Main Interface -->
    <div class="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <!-- Image Upload Area -->
        <div class="space-y-2">
          <label for="file-upload" class="block text-sm font-medium text-white">Upload Image</label>
          <div
  class="relative border-2 border-dashed border-gray-400/30 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200"
  role="button"
  tabindex="0"
  @keydown.enter="fileInput?.click()"
  @keydown.space="fileInput?.click()"
  @click="fileInput?.click()"
  aria-label="Upload image by clicking or dragging and dropping"
>

            <input
              id="file-upload"
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              class="hidden"
              aria-label="Choose an image file"
            >
            <div v-if="!selectedImage" class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-gray-300">
                <span class="font-medium">Click to upload</span> or drag and drop
              </div>
              <p class="text-xs text-gray-300">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div v-else class="flex flex-col items-center gap-4">
              <div class="w-full flex justify-center">
                <img 
                  :src="selectedImage" 
                  class="h-64 w-auto rounded-lg object-contain" 
                  :alt="'Uploaded image preview'" 
                >
              </div>
              <button 
                @click="removeImage"
                class="text-sm text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Remove uploaded image"
              >
                Remove image
              </button>
              <p class="text-sm text-gray-400 text-center">
  Mode: <span class="font-semibold">{{ settings.useCognitiveLayer ? 'CNN + LLM' : 'LLM Only' }}</span>
</p>

            </div>
          </div>
        </div>

        <button 
          @click="analyzeImage"
          :disabled="!selectedImage"
          class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :aria-busy="loading"
        >
          <span v-if="!loading">Analyze Image</span>
          <span v-else class="sr-only">Analyzing image...</span>
        </button>

        <div v-if="loading" class="text-center text-white" role="status" aria-live="polite">
          <div class="inline-flex items-center space-x-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
            <span>Analyzing...</span>
          </div>
        </div>
        
        <div v-if="results" class="mt-4 space-y-4" role="region" aria-label="Analysis results">
  <div class="p-4 bg-white/10 rounded-lg border border-gray-400/20">
    <h3 class="font-semibold mb-2 text-white">Model Used:</h3>
    <p class="text-gray-200">{{ settings.selectedModel }}</p>
    <p class="text-gray-200" aria-labelledby="google-vision-label">{{ results.altText }}</p>
  </div>

  <!---<div class="p-4 bg-white/10 rounded-lg border border-gray-400/20">
    <h3 id="aircraft-label" class="font-semibold mb-2 text-white">Aircraft Classification:</h3>
    <p class="text-gray-200" aria-labelledby="aircraft-label">Type: {{ results.aircraft }}</p>
    <p class="text-gray-200" aria-labelledby="aircraft-label">Confidence: {{ (results.confidence * 100).toFixed(2) }}%</p>
  </div>
</div>-->


        <div v-if="error" class="mt-4 p-4 bg-red-900/50 rounded-lg border border-red-500/20" role="alert">
          <p class="text-red-200">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="mt-8">
      <Settings />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useSettingsStore } from './stores/settings';
import Settings from './components/Settings.vue';

/**
 * Store instance for managing application settings
 * @type {import('./stores/settings').SettingsStore}
 */
const settings = useSettingsStore();

/**
 * Reference to the file input element
 * @type {import('vue').Ref<HTMLInputElement | null>}
 */
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * Base64 encoded preview of the selected image
 * @type {import('vue').Ref<string | null>}
 */
const selectedImage = ref<string | null>(null);

/**
 * The actual file object selected by the user
 * @type {import('vue').Ref<File | null>}
 */
const selectedFile = ref<File | null>(null);

/**
 * Loading state for the analysis process
 * @type {import('vue').Ref<boolean>}
 */
const loading = ref(false);

/**
 * Error message if analysis fails
 * @type {import('vue').Ref<string | null>}
 */
const error = ref<string | null>(null);

/**
 * Analysis results from the AI model
 * @type {import('vue').Ref<{altText: string; aircraft: string; confidence: number} | null>}
 */
const results = ref<{
  altText: string;
  aircraft: string;
  confidence: number;
} | null>(null);

/**
 * Handles file selection and creates a preview
 * @param {Event} event - The file input change event
 * @returns {Promise<void>}
 */
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    selectedFile.value = file;
    selectedImage.value = await downscaleImage(file);
  }
}

/**
 * Creates a downscaled preview of the selected image
 * @param {File} file - The image file to downscale
 * @returns {Promise<string>} Base64 encoded preview image
 */
function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          }
        } else {
          if (height > MAX) {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Failed to get canvas context");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Removes the selected image and resets the form
 * @returns {void}
 */
function removeImage() {
  selectedFile.value = null;
  selectedImage.value = null;
  if (fileInput.value) fileInput.value.value = "";
  results.value = null;
}

/**
 * Submits the image for analysis to the backend
 * @returns {Promise<void>}
 */
async function analyzeImage() {
  if (!selectedFile.value) {
    alert("No image selected");
    return;
  }

  loading.value = true;
  error.value = null;
  results.value = null;

  try {
    const endpoint = settings.useCognitiveLayer
  ? "/api/cnn-llm/predict"
  : "/api/llm/process-form";

const formData = new FormData();
formData.append("Image", selectedFile.value);
formData.append("Model", settings.selectedModel);
formData.append("Prompt", settings.prompt || "");
formData.append("Temperature", settings.temperature.toString());


const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

    results.value = {
      altText: response.data.response ?? "No alt text returned.",
      aircraft: response.data.aircraft ?? "Unknown",
      confidence: response.data.confidence ?? 0
    };
  } catch (err) {
    console.error("Error during image analysis:", err);
    error.value = "Image analysis failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  margin-top: 60px;
}

/* Focus styles for keyboard navigation */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (forced-colors: active) {
  .border-dashed {
    border-style: dashed;
  }
  
  button:disabled {
    border-color: GrayText;
  }
}
</style> 
