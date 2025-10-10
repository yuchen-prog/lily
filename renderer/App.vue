<script setup lang="ts">
import TitleBar from '@renderer/components/TitleBar.vue'
import { NConfigProvider } from 'naive-ui'

</script>
<template>
<n-config-provider class="h-[100vh] w-[100vw] flex">
    <aside class=" h-full flex flex-shrink-0 flex-col w-[200px] bg-blue-200">
      Aside
    </aside>
    <div class="flex-auto">
      <title-bar />
       
      Main
    </div>
  </n-config-provider>
</template>
