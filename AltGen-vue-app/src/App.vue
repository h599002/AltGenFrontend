<template>
  <div>
    <h1>AltGen API Test</h1>
    
    <input type="text" v-model="inputText" placeholder="Enter test text">
    
    <select v-model="selectedApi">
      <option value="google/gemini-flash-1.5-8b">Google Gemini</option>
      <option value="openai/gpt-4o-mini">OpenAI GPT-4</option>
      <option value="meta-llama/llama-3.3-70b-instruct">Meta Llama</option>
      <option value="deepseek/deepseek-r1">DeepSeek</option>
    </select>

    <button @click="generateAltText">Generate Alt Text</button>

    <h3>API Response:</h3>
    <p v-if="loading">Generating...</p>
    <p v-if="altText">{{ altText }}</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const inputText = ref(""); // Stores the user input text
    const altText = ref("");
    const loading = ref(false);
    const selectedApi = ref("google/gemini-flash-1.5-8b");

    async function generateAltText() {
      console.log("Generating alt text...");
      if (!inputText.value.trim()) {
        alert("Please enter some text first.");
        return;
      }

      console.log("Sending request to API...");

      loading.value = true;

      const apiBaseUrl = "http://localhost:5256/api/Test/";
      const url = `${apiBaseUrl}${selectedApi.value}`;

      try{
        const response = await fetch(url, { // Replace with correct API URL
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "*/*" },
          body: JSON.stringify({ prompt: inputText.value }) // Sending text instead of image
        });

        console.log("Request sent, waiting for response...");
        
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response received:", data); // ✅ Debugging
        altText.value = data.response || "No response received";
        loading.value = false;
      } catch (error) {
        console.error(error);
        altText.value = "An error occurred. Please try again.";
      } 
      finally {
        loading.value = false;
      }
    
    }
    return { inputText, generateAltText, altText, loading };
  }, 
};
</script> 
