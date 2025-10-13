<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';
import { useWinManager } from '@renderer/hooks/useWinManager';
import DragRegion from '@renderer/components/DragRegion.vue'

interface TitleBarProps {
  title?: string;
  isMaximizable?: boolean;
  isMinimizable?: boolean;
  isClosable?: boolean;
}
defineOptions({ name: 'TitleBar' })
withDefaults(defineProps<TitleBarProps>(), {
  isMaximizable: true,
  isMinimizable: true,
  isClosable: true,
  title: ''
})
const emit = defineEmits(['close']);
const btnSize = 15;

const {
  isMaximized,
  toggleClose,
  minimize,
  maximize
} = useWinManager();

function handleClose() {
  emit('close');
  toggleClose();
}
</script>
<template>
  <header class="title-bar flex items-start justify-between h-[30px]">
    <div class="title-bar-main flex-auto h-full">
        <drag-region class="w-full">
            <div class="flex justify-center font-bold">
                {{ title ?? '' }}
            </div>
        </drag-region>
    </div>
    <div class="title-bar-controls w-[80px] flex items-center justify-end text-tx-secondary">
      <button v-show="isMinimizable" class="title-bar-button cursor-pointer hover:bg-input" @click="minimize">
        <iconify-icon icon="material-symbols:chrome-minimize-sharp" :width="btnSize" :height="btnSize" />
      </button>
      <button v-show="isMaximizable" class="title-bar-button cursor-pointer hover:bg-input" @click="maximize">
        <iconify-icon icon="material-symbols:chrome-maximize-outline-sharp" :width="btnSize" :height="btnSize"
          v-show="!isMaximized" />
        <iconify-icon icon="material-symbols:chrome-restore-outline-sharp" :width="btnSize" :height="btnSize"
          v-show="isMaximized" />
      </button>
      <button v-show="isClosable" class="close-button title-bar-button cursor-pointer hover:bg-red-300 "
        @click="handleClose">
        <iconify-icon icon="material-symbols:close" :width="btnSize" :height="btnSize"></iconify-icon>
      </button>
    </div>
  </header>
</template>

<style scoped>
.title-bar-button {
  padding: 2px;
  border-radius: 50%;
  margin: .2rem;
}
</style>