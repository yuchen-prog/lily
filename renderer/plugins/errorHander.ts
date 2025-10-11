// 错误处理plugin

import { type Plugin } from 'vue'
import { logger } from '@renderer/utils/logger';
const errorHandler: Plugin = {
    install(app) {
        app.config.errorHandler = (err, vm, info) => {
            logger.error('Vue errorHandler:', err, vm, info);
            // 这里可以添加更多的错误处理逻辑，比如发送错误日志到服务器
        };

        window.addEventListener('error', (event) => {
            logger.error('Global error event:', event.message, event.filename, event.lineno, event.colno, event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            logger.error('Unhandled promise rejection:', event.reason);
        });
    }
};

export default errorHandler;