
import { type Plugin } from 'vue'

// 引入需要注册的全局组件
import DragRegion from "@renderer/components/DragRegion.vue";
import TitleBar from "@renderer/components/TitleBar.vue";
import { Icon as iconifyIcon } from "@iconify/vue"
import NativeTooltip from '@renderer/components/NativeTooltip.vue';

export const componentsPlugin: Plugin = {
    install(app) {
        // 在这里注册全局组件
        app.component('DragRegion', DragRegion);
        app.component('TitleBar', TitleBar);
        app.component('IconifyIcon', iconifyIcon);
        app.component('NativeTooltip', NativeTooltip);
    }
}