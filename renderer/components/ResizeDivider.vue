<template>
  <div :class="className" @click.stop @mousedown="startDrag"></div>
</template>

<script setup lang="ts">
interface IProps {
  orientation: 'horizontal' | 'vertical';
  margin: number;
  minMargin: number;
  maxMargin: number;
}

const className = computed(() => `${props.orientation}-divider`)
const props = withDefaults(defineProps<IProps>(), {
  orientation: 'vertical',
  margin: 320,
  minMargin: 200,
  maxMargin: 500,
})

const emit = defineEmits<{
  (e: 'update:margin', value: number): void
}>()

const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })

const margin = ref(props.margin)
watchEffect(() => {
  margin.value = props.margin
})

function startDrag(e: MouseEvent) {
  isDragging.value = true
  startPos.value = { x: e.clientX, y: e.clientY }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  const delta = props.orientation === 'vertical' ? e.clientX - startPos.value.x : e.clientY - startPos.value.y
  let newMargin = props.margin + delta
  newMargin = Math.max(props.minMargin, Math.min(props.maxMargin, newMargin))
  emit('update:margin', newMargin)
  startPos.value = { x: e.clientX, y: e.clientY }
}

function onMouseUp() {
  isDragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onMouseUp)
}

defineOptions({
  name: "ResizeDivider",
})

</script>

<style scoped>
.vertical-divider {
  height: 100%;
  width: 5px;
  cursor: ew-resize;
  background-color: var(--divider-color);
}

.horizontal-divider {
  width: 100%;
  height: 5px;
  cursor: ns-resize;
  background-color: var(--divider-color);
}
</style>