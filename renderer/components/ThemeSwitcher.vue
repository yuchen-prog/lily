<template>
    <li class="sidebar-item no-drag cursor-pointer hover:text-primary-subtle">
        <iconify-icon :icon="themeIcon" @click="toggleTheme" width="24" height="24" />
    </li>
</template>

<script setup lang="ts">
import {} from "vue"
import { Icon as iconifyIcon } from "@iconify/vue"
import { useThemeMode } from "@renderer/hooks/useThemeMode";

const { themeIcon, toggleTheme } = useThemeMode()
</script>

<style scoped></style>
