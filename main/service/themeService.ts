import { logManager } from './logService';
import { IPC_EVENTS } from "@common/constants";
import { BrowserWindow, ipcMain, IpcMainInvokeEvent, nativeTheme } from "electron";

class ThemeService {
    
    private static _instance: ThemeService;
    private _isDarkMode: boolean = nativeTheme.shouldUseDarkColors;

    constructor() {

        this._isDarkMode = nativeTheme.shouldUseDarkColors;
        this._setupIpcEvents();
        logManager.info('ThemeService initialized');
    }

    private _setupIpcEvents() {
        // Setup IPC event listeners if needed
        ipcMain.handle(IPC_EVENTS.THEME_GET, (_e: IpcMainInvokeEvent) => {
            return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
        });

        ipcMain.handle(IPC_EVENTS.IS_DARK_MODE, (_e: IpcMainInvokeEvent) => {
            return nativeTheme.shouldUseDarkColors
        });

        ipcMain.on(IPC_EVENTS.THEME_SET, (_e, theme: 'light' | 'dark' | 'system') => {
            nativeTheme.themeSource = theme;
        });

        // nativeTheme updated event
        nativeTheme.on('updated', () => {
            this._isDarkMode = nativeTheme.shouldUseDarkColors;
            logManager.info(`Theme updated: ${this._isDarkMode ? 'dark' : 'light'}`);
            // Notify all renderer processes about the theme change
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send(IPC_EVENTS.THEME_MODE_UPDATED, this._isDarkMode);
            });
        });
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new ThemeService();
        }
        return this._instance;
    }

    public get isDarkMode() {
        return this._isDarkMode;
    }
}

export const themeManager = ThemeService.getInstance();
export default themeManager;