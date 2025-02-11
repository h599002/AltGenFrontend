<template>
  <div>
    <h1>AltGen Preview</h1>
    <input type="file" @change="uploadImage">
    <button @click="generateAltText">Generate Alt Text</button>
    <h3>Generated Alt Text:</h3>
    <p v-if="loading">Generating...</p>
    <p v-if="altText">{{ altText }}</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const image = ref(null);
    const altText = ref("");
    const loading = ref(false);

    function uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        image.value = reader.result.split(",")[1];
      };
    }

    async function generateAltText() {
      if (!image.value) {
        alert("Please upload an image first.");
        return;
      }
      loading.value = true;

      const response = await fetch("https://your-dotnet-api.com/api/generate-alt-text", { // TODO replace with your API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image.value })
      });

      const data = await response.json();
      altText.value = data.altText;
      loading.value = false;
    }

    return { uploadImage, generateAltText, altText, loading };
  }
};
</script>
