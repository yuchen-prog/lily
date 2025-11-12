<template>
  <n-button @click="toggleRecognition">
    {{ listening ? '停止识别' : '开始识别' }}
  </n-button>

  <div class="mt-3 grid grid-cols-2 gap-4">
    <div>
      <p class="font-semibold">实时识别（partial）</p>
      <div class="border p-2 mt-1 bg-gray-100 min-h-[100px] whitespace-pre-wrap">
        {{ partialText }}
      </div>
    </div>
    <div>
      <p class="font-semibold">最终识别（text）</p>
      <div class="border p-2 mt-1 bg-gray-100 min-h-[100px] whitespace-pre-wrap">
        <template v-if="finalTexts.length === 0">暂无最终结果</template>
        <ul v-else>
          <li v-for="(line, i) in finalTexts" :key="i">{{ line }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { speechService } from '@renderer/service/speechService'
import { NButton } from 'naive-ui'

onMounted(async () => {
  await speechService.init()
})

const listening = ref(false)
const partialText = ref('')
const finalTexts = ref<string[]>([])

const start = async () => {
  partialText.value = ''
  finalTexts.value = []
  await speechService.start(
    (partial: string) => {
      partialText.value = partial
    },
    (finalText: string) => {
      if (finalText) finalTexts.value.push(finalText)
    }
  )
  listening.value = true
}

const stop = () => {
  speechService.stop()
  listening.value = false
}

const toggleRecognition = () => {
  if (listening.value) stop()
  else start()
}

defineOptions({
  name: 'MainContainer',
})
</script>

<style scoped>
/* 简易展示样式 */
</style>