
// 将窗口管理相关行为抽离出来

import { BrowserWindow, BrowserWindowConstructorOptions, IpcMainEvent, IpcMainInvokeEvent, app, ipcMain, nativeTheme, screen } from 'electron';
import path from 'path';
import { IPC_EVENTS } from '../../common/constants';
import { logManager } from './logService';
import { themeManager } from './themeService';

interface ISizeOption {
    width: number;
    height: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
}

// nativeTheme.themeSource = 'dark';

const WINDOW_OPTIONS = {
    titleBarStyle: 'hidden',
    tite: 'Lily',
    darkTheme: themeManager.isDarkMode,
    backgroundColor: themeManager.isDarkMode ? '#2C2C2C' : '#ffffff',
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, // 出于安全考虑，默认启用上下文隔离
        nodeIntegration: false, // 出于安全考虑，默认禁用 Node.js 集成
        devTools: true, // 是否启用开发者工具
        enableRemoteModule: false, // 出于安全考虑，默认禁用远程模块
        sandbox: true, // 启用渲染进程沙箱
        backgroundThrottling: false, // 禁用后台节流，确保在后台时仍然保持高性能
    },
} as BrowserWindowConstructorOptions;

class WindowService {

    private static _instance: WindowService;

    constructor() {
        this._setupIpcEvents();
        logManager.info('WindowService initialized');
    }

    private _setupIpcEvents() {
        ipcMain.on(IPC_EVENTS.WINDOW_MIN, (e: IpcMainEvent) => {
            this.toggleMin(BrowserWindow.fromWebContents(e.sender));
        });

        ipcMain.on(IPC_EVENTS.WINDOW_MAX, (e: IpcMainEvent) => {
            this.toggleMax(BrowserWindow.fromWebContents(e.sender));
        });

        ipcMain.on(IPC_EVENTS.WINDOW_CLOSE, (e: IpcMainEvent) => {
            this.toggleClose(BrowserWindow.fromWebContents(e.sender));
        });

        ipcMain.handle(IPC_EVENTS.IS_WINDOW_MAX, (e: IpcMainInvokeEvent) => {
            return BrowserWindow.fromWebContents(e.sender)?.isMaximized() ?? false;
        });
    }

    public toggleMax(target: BrowserWindow | void | null) {
        if (!target) return;
        if (target.isMaximized()) {
            target.unmaximize();
        } else {
            target.maximize();
        }
    }

    public toggleClose(target: BrowserWindow | void | null) {
        if (!target) return;
        target.close()
    }

    public toggleMin(target: BrowserWindow | void | null) {
        if (!target) return;
        target.minimize();
    }

    public static getInstance(): WindowService {
        if (!this._instance) {
            this._instance = new WindowService();
        }
        return this._instance;
    }

    public createWindow(sizeOption: ISizeOption, additionalOptions?: BrowserWindowConstructorOptions) {
        const options = {
            ...WINDOW_OPTIONS,
            ...sizeOption,
            ...additionalOptions,
        } as BrowserWindowConstructorOptions;

        const window = new BrowserWindow(options);
        this._loadWindowTemplate(window);
        return window;
    }

    // 设置窗口生命周期相关事件
    private _setupWinLifeCycle() {
        
    }


    private _loadWindowTemplate(window: BrowserWindow) {
        // and load the index.html of the app.
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}${'/html/'}`);
        } else {
            window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/index.html`));
        }
    }
}


export const windowManager = WindowService.getInstance();

export default windowManager
