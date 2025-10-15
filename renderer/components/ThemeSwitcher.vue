<template>
    <li class="sidebar-item no-drag cursor-pointer hover:text-primary-subtle">
        <native-tooltip :content="themeTooltip">
            <iconify-icon :icon="themeIcon" @click="toggleTheme" width="24" height="24" />
        </native-tooltip>
    </li>
</template>

<script setup lang="ts">
import {} from "vue"
import { useThemeMode } from "@renderer/hooks/useThemeMode";

const { themeIcon, toggleTheme, themeTooltip } = useThemeMode()
</script>

<style scoped></style>
