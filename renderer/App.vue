<script setup lang="ts">
import TitleBar from '@renderer/components/TitleBar.vue'
import { NConfigProvider } from 'naive-ui'
import NavBar from '@renderer/components/NavBar.vue'
import ResizeDivider from '@renderer/components/common/ResizeDivider.vue'
import MainContainer from '@renderer/components/main/index.vue'
import UserInfoPanel from '@renderer/components/guide/UserInfoPanel.vue'

const sideBarWidth = ref(800)

// setTimeout(() => {

//   setInterval(() => {
//     sideBarWidth.value -= 10
//   }, 16);
// }, 2000);
</script>
<template>
<n-config-provider class="h-[100vh] w-[100vw] flex">
    <aside class="sidebar h-full flex flex-shrink-0 flex-col" :style="{width: `${sideBarWidth}px`}">
      <div class="flex-auto flex">
        <nav-bar />
        <div class="flex-auto text-tx-primary">
          <user-info-panel />
        </div>
      </div>
    </aside>
    <resize-divider 
      orientation="vertical" 
      :minMargin="200" 
      :maxMargin="800"
      v-model:margin="sideBarWidth"
    />
    <div class="flex-auto text-tx-primary">
      <title-bar /> 
      <main-container />
    </div>
  </n-config-provider>
</template>

<style scoped>
.sidebar {
  background-color: var(--bg-color);
  box-shadow: -3px -2px 10px rgba(101, 101, 101, 0.2);
}
</style>
