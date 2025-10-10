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
    }
}

contextBridge.exposeInMainWorld('api', api)