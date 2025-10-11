
export enum IPC_EVENTS {
    // 窗口行为默认事件
    WINDOW_MIN = 'window-min',
    WINDOW_MAX = 'window-max',
    WINDOW_CLOSE = 'window-close',
    IS_WINDOW_MAX = 'is-window-max',

    // log相关行为
    LOG_INFO = 'log-info',
    LOG_WARN = 'log-warn',
    LOG_ERROR = 'log-error',
    LOG_DEBUG = 'log-debug',
}

export enum WINDOW_NAMES {
    MAIN_WINDOW = 'main-window',
    SETTINGS_WINDOW = 'settings-window',
    DIALOG_WINDOW = 'dialog-window',
}

export const MAIN_WINDOW_SIZE = {
    width: 1024,
    height: 800,
    minWidth: 1024,
    minHeight: 800,
} as const;
