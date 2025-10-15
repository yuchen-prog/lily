

const themeIconMap = new Map<ThemeMode, string>([
    ['system', 'material-symbols:auto-awesome-outline'],
    ['light', 'material-symbols:light-mode-outline'],
    ['dark', 'material-symbols:dark-mode-outline'],
]);

export function useThemeMode() {
    const isDark = ref<boolean>(false);
    const themeMode = ref<ThemeMode>('dark')

    const { t } = useI18n();
   
    onMounted(async () => {
        await nextTick();
        themeMode.value = await window.api.getTheme() as ThemeMode;
        isDark.value = await window.api.isDarkMode();

        // 监听主题变化
        window.api.onThemeModeUpdated((newIsDark: boolean) => {
            isDark.value = newIsDark;
            themeMode.value = newIsDark ? 'dark' : 'light';
        })
    })

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        const newTheme = isDark.value ?  'dark':'light';
        window.api.setTheme(newTheme);
    }

    const themeTooltip = computed(() => {
        return isDark.value ? t("main.sidebar.light") : t("main.sidebar.dark");
    })

    const themeIcon = computed(() => themeIconMap.get(themeMode.value) || 'material-symbols:auto-awesome-outline');

    return {
        isDark,
        toggleTheme,
        themeIcon,
        themeTooltip,
    }
}