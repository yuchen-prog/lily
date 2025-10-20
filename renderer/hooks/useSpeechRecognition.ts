export function useSpeechRecognition() {

    const isSupported = computed(() => {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    });

    const startRecognition = () => {
        console.log("start speech recognition");
    }

    const stopRecognition = () => {
        console.log("stop speech recognition");
    }

    return {
        isSupported,
        startRecognition,
        stopRecognition
    }
}