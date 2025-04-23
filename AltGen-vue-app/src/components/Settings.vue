<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { ref } from 'vue'

const settings = useSettingsStore()
const showSettings = ref(false)
const showCustomPrompt = ref(false)

const models = [
  { name: 'Google Gemini', value: 'google/gemini-flash-1.5-8b' },
  { name: 'OpenAI GPT-4', value: 'openai/gpt-4' },
  { name: 'Meta Llama', value: 'meta/llama-2-70b' },
  { name: 'DeepSeek', value: 'deepseek/deepseek-coder-33b' }
]

const promptTemplates = [
  { name: 'Default', value: 'Generate a descriptive alt text for this image that is clear and concise.' },
  { name: 'Detailed', value: 'Create a detailed alt text for this image that describes the visual elements and their relationships.' },
  { name: 'Concise', value: 'Write a concise alt text for this image that focuses on the main subject and key details.' },
  { name: 'Custom Template', value: '' }
]

/**
 * Handles the change event of the prompt template selection dropdown.
 * If "Custom Template" is selected, shows the custom prompt textarea.
 * Otherwise, updates the prompt with the selected template value.
 * 
 * @param {Event} event - The change event from the select element
 */
function handlePromptChange(event: Event) {
  const select = event.target as HTMLSelectElement
  const selectedTemplate = promptTemplates.find(t => t.value === select.value)
  if (selectedTemplate?.name === 'Custom Template') {
    showCustomPrompt.value = true
  } else {
    showCustomPrompt.value = false
    settings.updatePrompt(select.value)
  }
}

/**
 * Toggles the visibility of the settings panel.
 * If the panel is visible, it will be hidden; if hidden, it will be shown.
 */
function toggleSettings() {
  showSettings.value = !showSettings.value
}

/**
 * Updates the selected model in the settings store.
 * 
 * @param {string} model - The model identifier to set
 */
function updateModel(model: string) {
  settings.updateModel(model)
}

/**
 * Updates the temperature setting in the settings store.
 * 
 * @param {number} value - The temperature value to set (0-1)
 */
function updateTemperature(value: number) {
  settings.updateTemperature(value)
}

/**
 * Updates the maximum length setting in the settings store.
 * 
 * @param {number} value - The maximum length value to set
 */
function updateMaxLength(value: number) {
  settings.updateMaxLength(value)
}

/**
 * Updates the prompt template in the settings store.
 * 
 * @param {string} value - The prompt template value to set
 */
function updatePrompt(value: string) {
  settings.updatePrompt(value)
}
</script>

<template>
  <div>
    <!-- Settings Icon -->
    <button 
      @click="toggleSettings" 
      class="settings-icon bg-gray-800/50 hover:bg-gray-800/70 p-2 rounded-full transition-colors"
      aria-label="Settings"
    >
      ⚙️
    </button>

    <!-- Overlay Background -->
    <div 
      v-if="showSettings" 
      class="overlay" 
      @click="toggleSettings"
    ></div>

    <!-- Slide-In Panel -->
    <transition name="slide">
      <div v-if="showSettings" class="settings-panel">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Settings</h2>
        </div>

        <!-- Temperature Control -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Temperature
            <span class="text-sm text-gray-500">({{ settings.temperature }})</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model="settings.temperature"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>Conservative - </span>
            <span>Creative</span>
          </div>
        </div>

        <!-- Max Length Control -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Words
            <span class="text-sm text-gray-500">({{ settings.maxLength }} words)</span>
          </label>
          <input
            type="range"
            min="10"
            max="250"
            step="5"
            v-model="settings.maxLength"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>Short - </span>
            <span>Long</span>
          </div>
        </div>

        <!-- Prompt Template Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Prompt Template
          </label>
          <select
            @change="handlePromptChange"
            class="w-full bg-white text-gray-800 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="template in promptTemplates" :key="template.name" :value="template.value">
              {{ template.name }}
            </option>
          </select>

          <!-- Custom Prompt Input -->
          <div v-if="showCustomPrompt" class="mt-2">
            <textarea
              v-model="settings.prompt"
              rows="3"
              class="w-full bg-white text-gray-800 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
              placeholder="Enter your custom prompt template..."
            ></textarea>
          </div>
        </div>

        <!-- Model Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            AI Model
          </label>
          <select
            v-model="settings.selectedModel"
            class="w-full bg-white text-gray-800 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="model in models" :key="model.name" :value="model.value">
              {{ model.name }}
            </option>
          </select>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Panel styles */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 300px;
  background: rgb(89, 89, 89);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  z-index: 1001;
  overflow-y: auto;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(79, 79, 79, 0.409);
  z-index: 1000;
}

/* Settings icon */
.settings-icon {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
  font-size: 1.5rem;
  cursor: pointer;
}
</style> 