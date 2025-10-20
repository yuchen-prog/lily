<template>

  <media-recorder></media-recorder>

  {{ result }}

  <div>
    <iconify-icon icon="mdi:microphone" width="48" height="48" :class="isListening ? 'text-green-500 animate-pulse' : 'text-gray-500'"/>
  </div>
</template>

<script setup lang="ts">
import MediaRecorder from '@renderer/components/main/MediaRecorder.vue';

import { useSpeechRecognition } from '@vueuse/core';

const { isSupported, start, result, isListening } = useSpeechRecognition();

onMounted(() => {
  // Any setup logic if needed
  if (isSupported) {
    console.log('Speech Recognition is supported.');
    start();
  }
});

watch(result, (newV) => {
  console.log('Speech Recognition Result:', newV);
});

defineOptions({
  name: 'MainContainer',
});
</script>

<style scoped>
/* Add your styles here */
</style>