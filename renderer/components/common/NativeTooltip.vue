<template>
    <template v-if="isRealElementSlot">
    <slot></slot>
  </template>
  <template v-else>
    <span :title="content">
      <slot></slot>
    </span>
  </template>
</template>

<script setup lang="ts">
import { logger } from '@renderer/utils/logger';


interface IProps {
  content: string
}

const props = withDefaults(defineProps<IProps>(), {
  content: '',
})

const slots = defineSlots()
// 不支持多个插槽节点
if (slots?.default && slots.default().length > 1) {
  logger.error('NativeTooltip 组件只支持单个子节点');
}

// 判断是否为真实的渲染节点插槽
const isRealElementSlot = computed(() => {
  const vnodes = slots?.default ? slots.default() : [];
  if (!vnodes || vnodes.length === 0) return false;
  return vnodes[0].el && vnodes[0].el instanceof HTMLElement;
})


function updateTooltipContent(content: string) {
  if (!isRealElementSlot.value) {
    return;
  }
  const defaultSlot = slots?.default?.()?.el as HTMLElement;
  defaultSlot.title = content
}

onMounted(()=> updateTooltipContent(props.content))

watch(()=>props.content, (val)=> updateTooltipContent(val));
defineOptions({
  name: 'NativeTooltip',
})

</script>

<style scoped></style>