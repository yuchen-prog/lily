

// 封装MediaRecorder相关功能的组合式函数
export function useMediaRecorder() {

    const isLoading = ref(false);
    const mediaStream = ref<MediaStream | null>(null);

    // 开启摄像头并获取MediaStream
    const startCamera = async (videoElement: HTMLVideoElement | null) => {
        isLoading.value = true;
        try {
            // 摄像头基本参数
            const constraints: MediaStreamConstraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: true
            }

            mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
            // 这里可以将stream绑定到video元素上进行预览
            console.log("Camera started", mediaStream.value);
            if (videoElement && mediaStream.value) {
                videoElement.srcObject = mediaStream.value;
            }
        } catch (error) {
            console.error("Error accessing media devices.", error);
        } finally {
            isLoading.value = false;
        }
    }


    // 检测浏览器是否支持MediaRecorder API
    const isSupported = computed(() => {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
            && (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                || MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
                || MediaRecorder.isTypeSupported('video/webm'));
    })

    const startRecording = () => {
        console.log("start recording");
    }

    const stopRecording = () => {
        console.log("stop recording");
    }

    return {
        startCamera,
        isLoading,
        isSupported,
        startRecording,
        stopRecording
    }
}