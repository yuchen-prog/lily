# Lily

A simple, beautiful and efficient desktop AI chat software.

> 这是一个使用 Electron Forge + Vite + Vue 3 构建的跨平台桌面应用，集成了主题切换、国际化、窗口管理、日志与（可选）离线语音识别能力。

## 技术栈
- Electron 37（使用 Electron Forge 驱动开发、打包）
- Vite 6（主进程/预加载/渲染进程分离构建）
- Vue 3 + Pinia + Vue Router + Vue I18n
- Naive UI + Tailwind CSS 4
- Iconify（图标）与 VueUse（组合式工具）
- electron-log（主进程日志）
- vosk-browser（离线语音识别，可选）

## 主要功能
- 自定义窗口标题栏与窗口控制（最小化/最大化/关闭）
- 系统主题联动与主题切换（深色/浅色/跟随系统）
- 国际化（内置 `zh` 与 `en` 文案）
- 主进程日志：自动生成日期日志文件、按大小滚动、保留天数清理
- 渲染进程错误捕获与日志上报（通过 `preload` 暴露的 `window.api.logger`）
- 多页面入口（`html/index.html`、`html/dialog.html`、`html/setting.html`）
- 离线语音识别服务（基于 `vosk-browser`，示例模型位于 `public/models/`）

## 目录结构
```
.
├── common/                 # 共享常量（IPC 事件、窗口尺寸等）
├── main/                   # 主进程代码（入口、窗口与服务）
│   ├── wins/               # 窗口创建逻辑
│   └── service/            # 主进程服务（日志、主题、窗口管理）
├── renderer/               # 渲染进程（Vue 应用）
│   ├── components/         # 组件（含标题栏、侧栏、主题切换等）
│   ├── hooks/              # 组合式函数（窗口/主题/媒体/语音识别）
│   ├── plugins/            # Vue 插件（错误处理、全局组件注册）
│   ├── service/            # 前端服务（语音识别）
│   ├── style/              # 全局样式与主题 CSS
│   └── index.ts            # 渲染进程入口
├── html/                   # 多页面 HTML 入口
├── locales/                # 多语言文案（`zh.json`、`en.json`）
├── preload.ts              # 预加载脚本（通过 ContextBridge 暴露 API）
├── forge.config.ts         # Electron Forge 配置（Vite、Fuses、Makers）
├── vite.*.config.ts        # Vite 配置（main/preload/renderer）
└── package.json            # 脚本与依赖
```

## 快速开始
### 环境要求
- Node.js ≥ 20（建议使用长期维护版）
- Windows、macOS 或 Linux（开发与打包跨平台）

### 安装依赖
```
npm install
```

### 开发模式启动
```
npm start
```
- 使用 Electron Forge 启动开发；Vite 负责主进程、预加载与渲染进程的构建与热更新。
- 渲染进程会从 `html/` 目录加载页面入口，Vue 应用挂载到 `#app`。

### 打包与发布
```
# 生成可分发包（不同平台使用对应 Maker）
npm run make

# 生成未安装的打包产物（asar 压缩）
npm run package

# 发布（需要额外配置发布目标）
npm run publish
```
- Forge 配置的 Makers：`squirrel`（Windows）、`zip`（macOS）、`deb`、`rpm`（Linux）。
- 打包默认启用 `asar`；Fuses 在打包阶段启用若干安全选项（如仅从 asar 加载应用、校验完整性等）。

## 主/渲染/预加载说明
### 主进程入口
- `main/index.ts`：应用启动、异常捕获、`setupWindows()` 创建主窗口。
- 通过 `main/service/windowService.ts` 管理窗口创建与加载：
  - 开发环境：`MAIN_WINDOW_VITE_DEV_SERVER_URL` 指向 Vite dev server 并加载 `html/`。
  - 生产环境：加载 `build` 后的 `html/index.html`（由 `vite.renderer.config.ts` 指定）。

### 预加载（ContextBridge）
- `preload.ts` 暴露 `window.api`，包含：
  - `closeWindow()`、`minimizeWindow()`、`maximizeWindow()`、`isMaximized()`
  - `logger.{info|warn|error|debug}()`（经由 `electron-log` 落盘）
  - `getTheme()`、`setTheme(theme)`、`isDarkMode()`、`onThemeModeUpdated(cb)`
- 渲染进程通过这些方法以 IPC 与主进程交互，保持 `contextIsolation: true`、`nodeIntegration: false` 与 `sandbox: true` 的安全配置。

### 渲染进程（Vue 应用）
- 入口：`renderer/index.ts`，注册 `i18n`、错误处理插件与全局组件插件；样式在 `renderer/style/index.css`。
- 主要组件：
  - `TitleBar.vue`：窗口控制与拖拽区域（配合 `DragRegion` 与 `NativeTooltip`）
  - `NavBar.vue` + `ThemeSwitcher.vue`：侧栏与主题切换
  - 其余业务面板在 `renderer/components/guide`、`renderer/components/main` 下。

## 国际化（i18n）
- 配置：`renderer/i18n.ts`，默认语言 `zh`，回退 `zh`。
- 文案：`locales/zh.json`、`locales/en.json`。
- 在组件中使用：
```ts
const { t } = useI18n();
// <native-tooltip :content='t("window.minimize")' />
```
- 如需扩展语言：添加 `locales/<lang>.json` 并在 `i18n.ts` 中引入。

## 主题切换
- 主进程：`themeService.ts` 使用 `nativeTheme` 管理主题，并广播 `THEME_MODE_UPDATED`。
- 渲染进程：`useThemeMode()` 读取与切换主题，`ThemeSwitcher.vue` 提供 UI。

## 窗口管理
- 主进程：`windowService.ts` 统一创建与控制窗口（启用隐藏标题栏、暗色背景等）。
- 渲染进程：`useWinManager()` 提供最小化/最大化/关闭与状态读取。

## 日志
- 主进程日志：`logService.ts` 使用 `electron-log`，日志文件按日期生成，路径：
  - Windows：`%AppData%/lily/logs/app-YYYY-MM-DD.log`
  - Mac：`~/Library/Application Support/lily/logs/app-YYYY-MM-DD.log`
  - Linux：`~/.config/lily/logs/app-YYYY-MM-DD.log`
- 默认保留 7 天，超过清理；文件最大 10MB 自动滚动。
- 渲染进程：`renderer/utils/logger.ts` 将 `console.*` 重定向至主进程日志（如果可用）。

## 离线语音识别（可选）
- 服务：`renderer/service/speechService.ts`，基于 `vosk-browser`。
- 示例模型：`public/models/vosk-model-small-cn-0.22.zip`（中文小模型）。
- 使用步骤：
```ts
import { speechService } from '@renderer/service/speechService';

await speechService.init('/models/vosk-model-small-cn-0.22.zip');
await speechService.start(
  (partial) => console.log('partial:', partial),
  (final) => console.log('final:', final)
);
// ...
speechService.stop();
```
- 注意事项：首次加载模型需时间；确保页面有麦克风权限；在生产环境需要正确设置 `publicDir` 与模型路径（已在 `vite.renderer.config.ts` 指定）。

## 配置与路径别名
- 三套 Vite 配置：`vite.main.config.ts`、`vite.preload.config.ts`、`vite.renderer.config.ts`
- 通用别名：`@common`、`@main`、`@renderer`、`@locales`
- 渲染构建入口（Rollup）：`html/index.html`、`html/dialog.html`、`html/setting.html`

## 常见问题
- Windows 开发模式下出现安装/卸载快捷方式处理：项目已使用 `electron-squirrel-startup` 自动处理。
- `contextIsolation`、`sandbox` 开启后无法访问 Node API：通过 `preload.ts` 的 `contextBridge` 暴露所需 API。
- Tailwind CSS 4 使用方式：已在 `renderer/style/index.css` 通过 `@import "tailwindcss"` 引入。

## 许可证
- MIT

---

如需将此项目作为模板继续开发：建议先梳理业务域、扩展路由与状态管理，完善 UI 交互，并按需启用/封装语音识别与媒体录制逻辑。