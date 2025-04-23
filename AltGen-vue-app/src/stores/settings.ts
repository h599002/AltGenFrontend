import { defineStore } from 'pinia'

/**
 * Store for managing application settings including temperature, max length, prompt template, and model selection.
 */
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    temperature: 0.7,
    maxLength: 200,
    prompt: 'Generate a descriptive alt text for this image that is clear and concise.',
    selectedModel: 'google/gemini-flash-1.5-8b'
  }),

  actions: {
    /**
     * Updates the temperature setting for text generation.
     * Controls the creativity/randomness of the output (0-1).
     * 
     * @param {number} value - The temperature value to set (0-1)
     */
    updateTemperature(value: number) {
      this.temperature = value
    },

    /**
     * Updates the maximum length setting for generated text.
     * Controls how long the generated alt text can be.
     * 
     * @param {number} value - The maximum length value to set
     */
    updateMaxLength(value: number) {
      this.maxLength = value
    },

    /**
     * Updates the prompt template used for text generation.
     * Defines how the AI should approach generating the alt text.
     * 
     * @param {string} value - The prompt template to set
     */
    updatePrompt(value: string) {
      this.prompt = value
    },

    /**
     * Updates the selected AI model for text generation.
     * Changes which model will be used to generate the alt text.
     * 
     * @param {string} value - The model identifier to set
     */
    updateModel(value: string) {
      this.selectedModel = value
    }
  }
}) 