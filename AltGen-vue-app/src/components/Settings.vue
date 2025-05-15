<template>
  <div>
    <!-- Settings Icon -->
    <transition name="fade">
      <button 
        v-if="!showSettings" 
        @click="toggleSettings" 
        class="settings-icon bg-gray-800/60 hover:bg-gray-800/80 p-3 rounded-full shadow-lg transition duration-200"
        aria-label="Open Settings"
      >
        <span aria-hidden="true">⚙️</span>
        <span class="sr-only"> Settings</span>
      </button>
    </transition>

    <!-- Overlay Background -->
    <div v-if="showSettings" class="overlay" @click="toggleSettings"></div>

    <!-- Slide-In Panel -->
    <transition name="slide">
      <aside v-if="showSettings" class="settings-panel" role="dialog" aria-label="Settings Panel">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-white">Settings</h2>
          <button 
            @click="toggleSettings" 
            class="text-white hover:text-gray-300 focus:outline-none"
            aria-label="Close Settings"
          >
            ✖️
          </button>
        </div>

        <!-- Temperature Control -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Temperature
            <span class="text-sm text-gray-400">({{ settings.temperature }})</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            v-model="settings.temperature"
            class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-400">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        <!-- Prompt Template Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Prompt Template
          </label>
          <select
            @change="handlePromptChange"
            class="w-full bg-gray-900 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="w-full bg-gray-900 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
              placeholder="Enter your custom prompt template..."
            ></textarea>
          </div>
        </div>

        <!-- Model Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1">
            AI Model
          </label>
          <select
            v-model="settings.selectedModel"
            class="w-full bg-gray-900 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="model in models" :key="model.name" :value="model.value">
              {{ model.name }}
            </option>
          </select>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { ref } from 'vue'

const settings = useSettingsStore()
const showSettings = ref(false)
const showCustomPrompt = ref(false)

const models = [
  { name: 'OpenAI GPT-4.1', value: 'ChatGpt4_1' },
  { name: 'OpenAI GPT-4o-mini', value: 'ChatGpt4_1Mini'},
  { name: 'OpenAI GPT-4 Nano', value: 'ChatGpt4_1Nano'},
  { name: 'Google Gemini 2.5 Flash', value: 'Gemini2_5Flash'},
  { name: 'Google Gemini 2.5 Flash Lite', value: 'Gemini2_5FlashLite'},
  { name: 'Google Gemma 3.4B', value: 'Gemma3_4B'},
  { name: 'Google Gemini 2.5 Flash Preview', value: 'Gemini2_5FlashPreview'},
  { name: 'Calude 3 Opus', value: 'Claude3Opus'},
  { name: 'Calude 3.7 Sonnet', value: 'Claude3_7Sonnet'},
  { name: 'Calude 3.5 Haiku', value: 'Claude3_5Haiku'},
  { name: 'Meta Llama 3.2 90B Vision Instruct', value: 'Llama3_2_90bVisionInstruct'},
  { name: 'Meta Llama 3.2 11B Vision Instruct', value: 'Llama3_2_11bVisionInstruct'},
  { name: 'Mistral Pixtral Large', value: 'MistralPixtralLarge'},
  { name: 'Mistral Pixtral 24B', value: 'MistralPixtral24b'},
  { name: 'Mistral Pixtral 12B', value: 'MistralPixtral12b'},
  { name: 'Qwen2.5 VL-72B Instruct', value: 'Qwen2_5Vl72bInstruct'},
  { name: 'Qwenn2.5 VL-7B Instruct', value: 'Qwen2_5Vl7bInstruct'},
  { name: 'Amazon Nova Lite V1', value: 'AmazonNovaLiteV1'},
  { name: 'Grok 2 Vision', value: 'Grok2Vision1212'},
  { name: 'Microsoft Phi-4', value: 'MicrosoftPhi4MultimodalInstruct'}
]

const promptTemplates = [
  { name: 'Default', value: '' },
  { name: 'Detailed', value: 'Create a detailed alt text for this image that describes the visual elements and their relationships.' },
  { name: 'Concise', value: 'Write a concise alt text for this image that focuses on the main subject and key details.' },
  { name: 'Custom Template', value: '' }
]

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

function toggleSettings() {
  showSettings.value = !showSettings.value
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 320px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  z-index: 1001;
  overflow-y: auto;
  color: white;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.settings-icon {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
