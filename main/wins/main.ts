import { MAIN_WINDOW_SIZE } from '../../common/constants'
import { windowManager } from '../service/WindowService'

export function setupMainWindow() {
    windowManager.createWindow(MAIN_WINDOW_SIZE)
}