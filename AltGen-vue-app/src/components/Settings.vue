<template>
  <div>
    <!-- Settings Icon -->
    <transition name="fade">
      <button 
        v-if="!showSettings" 
        @click="toggleSettings" 
        class="settings-icon bg-gray-800/60 hover:bg-gray-800/80 p-3 rounded-full shadow-lg transition duration-200"
        aria-label="Open Settings"
        :aria-expanded="showSettings"
        aria-controls="settings-panel"
      >
        <span aria-hidden="true">⚙️</span>
        <span class="sr-only"> Settings</span>
      </button>
    </transition>

    <!-- Overlay Background -->
    <div v-if="showSettings" class="overlay" @click="toggleSettings"></div>

    <!-- Slide-In Panel -->
    <transition name="slide">
      <aside v-if="showSettings" 
        class="settings-panel" 
        role="dialog" 
        aria-label="Settings Panel"
        id="settings-panel"
        aria-modal="true"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 id="settings-heading" tabindex="-1" class="text-xl font-semibold text-white">Settings</h2>
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
            aria-valuemin="0"
            aria-valuemax="2"
            :aria-valuenow="settings.temperature"
            aria-valuetext="Temperature: ${settings.temperature}"
          />
          <div class="flex justify-between text-xs text-gray-400">
            <span>Conservative</span>
            <span> - Creative</span>
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
            aria-label="Select prompt template"
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
              aria-label="Custom prompt template"
            ></textarea>
          </div>
        </div>
        <!-- CNN Toggle -->
        <div class="mb-4 flex items-center gap-2">
  <input
    type="checkbox"
    v-model="settings.useCognitiveLayer"
    class="form-checkbox h-4 w-4 text-blue-600"
    id="use-cnn-toggle"
  />
  <label for="use-cnn-toggle" class="text-sm font-medium text-gray-300">
    Use Cognitive Layer (CNN)
  </label>
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
import { nextTick, ref, onMounted, onUnmounted } from 'vue'

/**
 * Store instance for managing application settings
 * @type {import('../stores/settings').SettingsStore}
 */
const settings = useSettingsStore()

/**
 * Controls the visibility of the settings panel
 * @type {import('vue').Ref<boolean>}
 */
const showSettings = ref(false)

/**
 * Controls the visibility of the custom prompt input
 * @type {import('vue').Ref<boolean>}
 */
const showCustomPrompt = ref(false)

/**
 * Available AI models for image analysis
 * @type {Array<{name: string, value: string}>}
 */
const models = [
  { name: 'OpenAI GPT-4.1', value: 'ChatGpt4_1' },
  { name: 'OpenAI GPT-4o-mini', value: 'ChatGpt4_1Mini'},
  { name: 'OpenAI GPT-4 Nano', value: 'ChatGpt4_1Nano'},
  { name: 'Google Gemini 2.0 Flash', value: 'Gemini2_0Flash'},
  { name: 'Google Gemini 2.0 Flash Lite', value: 'Gemini2_0FlashLite'},
  { name: 'Google Gemma 3 4B', value: 'Gemma3_4B'},
  { name: 'Google Gemini 2.5 Flash Preview', value: 'Gemini2_5FlashPreview'},
  { name: 'Claude 3 Opus', value: 'Claude3Opus'},
  { name: 'Claude 3.7 Sonnet', value: 'Claude3_7Sonnet'},
  { name: 'Claude 3.5 Haiku', value: 'Claude3_5Haiku'},
  { name: 'Meta Llama 3.2 90B Vision Instruct', value: 'Llama3_2_90bVisionInstruct'},
  { name: 'Meta Llama 3.2 11B Vision Instruct', value: 'Llama3_2_11bVisionInstruct'},
  { name: 'Mistral Pixtral Large', value: 'MistralPixtralLarge'},
  { name: 'Mistral Pixtral 24B', value: 'MistralPixtral24b'},
  { name: 'Mistral Pixtral 12B', value: 'MistralPixtral12b'},
  { name: 'Qwen2.5 VL-72B Instruct', value: 'Qwen2_5Vl72bInstruct'},
  { name: 'Qwen2.5 VL-7B Instruct', value: 'Qwen2_5Vl7bInstruct'},
  { name: 'Amazon Nova Lite V1', value: 'AmazonNovaLiteV1'},
  { name: 'Grok 2 Vision', value: 'Grok2Vision1212'},
  { name: 'Microsoft Phi-4', value: 'MicrosoftPhi4MultimodalInstruct'}
]

/**
 * Predefined prompt templates for image analysis
 * @type {Array<{name: string, value: string}>}
 */
const promptTemplates = [
  { name: 'Default', value: '' },
  { name: 'Detailed', value: 'Create a detailed alt text for this image that describes the visual elements and their relationships.' },
  { name: 'Concise', value: 'Write a concise alt text for this image that focuses on the main subject and key details.' },
  { name: 'Custom Template', value: '' }
]

/**
 * Handles prompt template selection and custom prompt visibility
 * @param {Event} event - The select element change event
 * @returns {void}
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
 * Toggles the settings panel visibility
 * @returns {void}
 */
function toggleSettings() {
  showSettings.value = !showSettings.value;
  if(showSettings.value) {
    nextTick(() =>  {
      const el = document.getElementById('settings-heading')
      el?.focus();
    });
  }
}

/**
 * Handles escape key press to close settings panel
 * @param {KeyboardEvent} e - The keyboard event
 * @returns {void}
 */
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && showSettings.value) {
    toggleSettings();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});

// Set default cognitive layer state
if (!settings.useCognitiveLayer) {
  settings.useCognitiveLayer = true;
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
  background: rgba(30, 41, 59, 0.98);
  backdrop-filter: blur(12px);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  z-index: 1001;
  overflow-y: auto;
  color: white;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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

/* WCAG 2.1 AA compliant text colors */
.text-gray-300 {
  color: rgba(255, 255, 255, 0.85);
}

.text-gray-400 {
  color: rgba(255, 255, 255, 0.75);
}

/* Ensure form controls meet contrast requirements */
.bg-gray-900 {
  background-color: rgb(17, 24, 39);
}

.border-gray-700 {
  border-color: rgba(55, 65, 81, 0.9);
}

/* Ensure focus states meet contrast requirements */
.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59, 130, 246);
}

/* High contrast mode support */
@media (forced-colors: active) {
  .settings-panel {
    border: 1px solid CanvasText;
  }
  
  .settings-icon {
    border: 1px solid ButtonText;
  }
  
  input[type="range"] {
    border: 1px solid ButtonText;
  }
}

/* Ensure disabled states meet contrast requirements */
button:disabled {
  opacity: 0.7;
}

/* Ensure placeholder text meets contrast requirements */
::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
