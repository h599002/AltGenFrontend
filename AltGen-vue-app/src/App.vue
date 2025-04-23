<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-white">AltGen</h1>
    </div>
    
    <!-- Main Interface -->
    <div class="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <!-- Image Upload Area -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">Upload Image</label>
          <div 
            class="relative border-2 border-dashed border-gray-400/30 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              class="hidden"
            >
            <div v-if="!selectedImage" class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-gray-400">
                <span class="font-medium">Click to upload</span> or drag and drop
              </div>
              <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div v-else class="flex flex-col items-center">
              <img :src="selectedImage" class="mx-auto h-64 w-auto rounded-lg object-contain" alt="Selected image">
              <button 
                @click="removeImage"
                class="mt-2 text-sm text-red-400 hover:text-red-300"
              >
                Remove image
              </button>
            </div>
          </div>
        </div>

        <button 
          @click="generateAltText"
          :disabled="!selectedImage"
          class="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Alt Text
        </button>

        <div v-if="loading" class="text-center text-gray-200">
          <div class="inline-flex items-center space-x-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating...</span>
          </div>
        </div>
        
        <div v-if="altText" class="mt-4 p-4 bg-white/10 rounded-lg border border-gray-400/20">
          <h3 class="font-semibold mb-2 text-white">Generated Alt Text:</h3>
          <p class="text-gray-200">{{ altText }}</p>
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
import { useSettingsStore } from './stores/settings'
import Settings from './components/Settings.vue'

const settings = useSettingsStore()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<string | null>(null)
const altText = ref("");
const loading = ref(false);

/**
 * Downscales an image file to a maximum size while maintaining aspect ratio.
 * 
 * @param {File} file - The image file to downscale
 * @returns {Promise<string>} A promise that resolves to the downscaled image as a data URL
 */
function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Handles the file selection event from the file input.
 * Validates that the selected file is an image and processes it.
 * 
 * @param {Event} event - The file selection event
 */
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.type.startsWith('image/')) {
      try {
        selectedImage.value = await downscaleImage(file)
      } catch (error) {
        console.error('Error processing image:', error)
        alert('Error processing image. Please try again.')
      }
    } else {
      alert('Please select an image file')
    }
  }
}

/**
 * Handles the file drop event from drag and drop.
 * Validates that the dropped file is an image and processes it.
 * 
 * @param {DragEvent} event - The drag and drop event
 */
async function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    try {
      selectedImage.value = await downscaleImage(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
    }
  } else {
    alert('Please drop an image file')
  }
}

/**
 * Removes the currently selected image and resets the file input.
 */
function removeImage() {
  selectedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Generates alt text for the selected image using the configured AI model.
 * Sends the image and settings to the API and updates the alt text field.
 */
async function generateAltText() {
  if (!selectedImage.value) {
    alert("Please upload an image first.");
    return;
  }

  loading.value = true;

  const apiBaseUrl = "http://localhost:5256/api/Test/";
  const url = `${apiBaseUrl}${settings.selectedModel}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
      body: JSON.stringify({ 
        image: selectedImage.value,
        prompt: settings.prompt
      })
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    altText.value = data.response || "No response received";
  } catch (error) {
    console.error(error);
    altText.value = "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
}

/**
 * Copies the generated alt text to the clipboard.
 * Shows a success message when the text is copied.
 */
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(altText.value)
    alert('Alt text copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy text:', error)
    alert('Failed to copy text to clipboard')
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
</style> 
