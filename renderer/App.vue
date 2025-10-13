<script setup lang="ts">
import TitleBar from '@renderer/components/TitleBar.vue'
import { NConfigProvider } from 'naive-ui'
import NavBar from '@renderer/components/NavBar.vue'

// 模拟一个error

onMounted(() => {

  // try {
  //   throw new Error('模拟一个错误')
  // } catch (error) {
  //   console.error('捕获到错误', error)
  // }
})
</script>
<template>
<n-config-provider class="h-[100vh] w-[100vw] flex">
    <aside class="sidebar h-full flex flex-shrink-0 flex-col w-[200px]">
      <div class="flex-auto flex">
        <nav-bar />
        <div class="flex-auto">
          conversation list
        </div>
      </div>
    </aside>
    <div class="flex-auto">
      <title-bar /> 
      Main
    </div>
  </n-config-provider>
</template>

<style scoped>
.sidebar {
  background-color: var(--bg-color);
  box-shadow: -3px -2px 10px rgba(101, 101, 101, 0.2);
}
</style>
