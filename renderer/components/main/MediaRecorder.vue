<template>
    <div class="video-container px-5">
        <!-- <button @click="startRecording">开始录制</button>
        <button @click="stopRecording" :disabled="!isRecording">停止录制</button> -->
        <video  
            ref="videoElement"
            autoplay
            muted
            playsinline
            class="video-preview"
        ></video>
        <!-- <NButton type="primary">test animation</NButton> -->
    </div>
</template>

<script setup lang="ts">
import { useMediaRecorder } from '@renderer/hooks/useMediaRecorder';
import { NButton } from 'naive-ui'


defineOptions({
    name: 'MediaRecorder',
});

const videoElement = ref<HTMLVideoElement | null>(null);
onMounted(() => {
    const { startCamera } = useMediaRecorder();   
    
    startCamera(videoElement.value!);
})

</script>

<style scoped>
.video-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    /* height: calc(100% - 30px); */
}
</style>