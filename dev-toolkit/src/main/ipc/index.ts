import { ipcMain } from 'electron'
import { registerImageIPC } from './image'
import { registerBookmarkIPC } from './bookmark'

export function registerIPC(): void {
  registerImageIPC()
  registerBookmarkIPC()

  ipcMain.handle('open-external', (_event, url: string) => {
    const { shell } = require('electron')
    shell.openExternal(url)
  })
}
