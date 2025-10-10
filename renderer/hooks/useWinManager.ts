import { nextTick, onMounted, ref } from "vue";

 export function useWinManager() {
    const isMaximized = ref(false);


    const toggleClose = () => {
        window.api.closeWindow();
    };

    const minimize = () => {
        window.api.minimizeWindow();
    }   

    const maximize = () => {
        window.api.maximizeWindow();
        isMaximized.value = !isMaximized.value;
    }

    onMounted(async () => {
        await nextTick();
        isMaximized.value = await window.api.isMaximized();
    })

    return {
        isMaximized,
        toggleClose,
        minimize,
        maximize
    }
 }