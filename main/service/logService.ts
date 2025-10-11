import { IPC_EVENTS } from '@common/constants';
import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

import log from 'electron-log';

class LogService {
    

    private static _instance: LogService;
    
    // 日志保留天数 默认为7天
    private readonly LOG_RETENTION_DAYS = 7;

    constructor() {
        this._ensureLogDirectoryExists();
        this._additionalLogProperties();
        this._setupIpcEvents();

        // 清除旧的日志
        this._cleanupOldLogs(this.LOG_RETENTION_DAYS); // 删除7天前的日志

        // 重写console方法
        this._rewriteConsole();
    }

    // 没有日志目录的话创建一个
    private _ensureLogDirectoryExists() {
        const logPath = this._getLogFileDir();
        console.log('Log path:', logPath);
        try {
            if (!fs.existsSync(logPath)) {
                fs.mkdirSync(logPath, { recursive: true });
            }
        } catch (error) {
            this.error('Failed to create log directory:', error);
        }
    }

    // 赋予一些其他的log属性
    private _additionalLogProperties() {
        const logPath = this._getLogFileDir();
        log.transports.file.resolvePathFn = () => {
            // 以当前日期命名日志文件
            const date = new Date();
            const formatDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
            return path.join(logPath, `app-${formatDate}.log`);
        }
        // 设置日志级别
        log.transports.file.level = 'debug';
        log.transports.console.level = 'debug';
        // 配置文件大小限制 10M
        log.transports.file.maxSize = 10 * 1024 * 1024;
        // 配置日志格式
        log.transports.file.format = '{h}:{i}:{s} {level} {text}';
    }

    private _rewriteConsole() {
        console.info = log.info;
        console.warn = log.warn;
        console.error = log.error;
        console.debug = log.debug;
        console.log = log.info;
    }

    private _getLogFileDir() {
        return path.join(app.getPath('userData'), 'logs');
    }

    private _cleanupOldLogs(days: number) {
        const logDir = this._getLogFileDir();
        fs.readdir(logDir, (err, files) => {
            if (err) {
                this.error('Failed to read log directory for cleanup:', err);
                return;
            }
            const now = Date.now();
            files.forEach(file => {
                const filePath = path.join(logDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        this.error('Failed to get file stats for log cleanup:', err);
                        return;
                    }
                    const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
                    if (ageInDays > days) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                this.error('Failed to delete old log file:', err);
                            } else {
                                this.info(`Deleted old log file: ${filePath}`);
                            }
                        });
                    }
                });
            });
        });
    }

    // Setup IPC event listeners for logging
    private _setupIpcEvents() {
        ipcMain.on(IPC_EVENTS.LOG_INFO, (_e, message: string, ...meta: any[]) => {
            this.info(message, ...meta);
        })
        ipcMain.on(IPC_EVENTS.LOG_WARN, (_e, message: string, ...meta: any[]) => {
            this.warn(message, ...meta);
        })
        ipcMain.on(IPC_EVENTS.LOG_ERROR, (_e, message: string, ...meta: any[]) => {
            this.error(message, ...meta);
        })
        ipcMain.on(IPC_EVENTS.LOG_DEBUG, (_e, message: string, ...meta: any[]) => {
            this.debug(message, ...meta);
        })
    }

    public static getInstance(): LogService {
        if (!this._instance) {
            this._instance = new LogService();
        }
        return this._instance;
    }

    /**
     * Log warning message
     * @param message - The message to log
     * @param meta  - Additional metadata
     */
    public warn(message: string, ...meta: any[]) {
        log.warn(message, ...meta);
    }

    /**
     * Log info message
     * @param message - The message to log
     * @param meta  - Additional metadata
     */
    public info(message: string, ...meta: any[]) {
        log.info(message, ...meta);
    }
    
    /**
     * Log error message
     * @param message - The message to log
     * @param meta  - Additional metadata
     */
    public error(message: string, ...meta: any[]) {
        log.error(message, ...meta);
    }

    /**
     * Log debug message
     * @param message - The message to log
     * @param meta  - Additional metadata
     */
    public debug(message: string, ...meta: any[]) {
        log.debug(message, ...meta);
    }
}

export const logManager = LogService.getInstance();
export default logManager;