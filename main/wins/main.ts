import { MAIN_WINDOW_SIZE } from '../../common/constants'
import { windowManager } from '../service/windowService'

export function setupMainWindow() {
    windowManager.createWindow(MAIN_WINDOW_SIZE)
}