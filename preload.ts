import { IPC_EVENTS } from '@common/constants';
import { contextBridge, ipcRenderer } from 'electron'

const api: WindowApi = {
    closeWindow: () => ipcRenderer.send(IPC_EVENTS.WINDOW_CLOSE),
    minimizeWindow: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MIN),
    maximizeWindow: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MAX),
    isMaximized: () => ipcRenderer.invoke(IPC_EVENTS.IS_WINDOW_MAX),
    onWindowMaximize: (callback: (isMaximized: boolean) => void) => {
        ipcRenderer.on('window-is-maximized', (_event, isMaximized) => {
            callback(isMaximized)
        })
    },
    logger: {
        debug: (message: string, ...meta: any[]) => ipcRenderer.send(IPC_EVENTS.LOG_DEBUG, message, ...meta),
        info: (message: string, ...meta: any[]) => ipcRenderer.send(IPC_EVENTS.LOG_INFO, message, ...meta),
        warn: (message: string, ...meta: any[]) => ipcRenderer.send(IPC_EVENTS.LOG_WARN, message, ...meta),
        error: (message: string, ...meta: any[]) => ipcRenderer.send(IPC_EVENTS.LOG_ERROR, message, ...meta),
    },

    getTheme: () => ipcRenderer.invoke(IPC_EVENTS.THEME_GET),
    setTheme: (theme: string) => ipcRenderer.send(IPC_EVENTS.THEME_SET, theme),
    isDarkMode: () => ipcRenderer.invoke(IPC_EVENTS.IS_DARK_MODE),
    onThemeModeUpdated: (callback: (isDark: boolean) => void) => {
        ipcRenderer.on(IPC_EVENTS.THEME_MODE_UPDATED, (_event, isDark) => {
            callback(isDark)
        })
    }



}

contextBridge.exposeInMainWorld('api', api)