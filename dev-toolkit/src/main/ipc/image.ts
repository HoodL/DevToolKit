import { ipcMain, dialog } from 'electron'
import { writeFile } from 'fs/promises'

export function registerImageIPC(): void {
  ipcMain.handle('select-images', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'] }
      ]
    })
    return result.filePaths
  })

  ipcMain.handle('save-compressed-image', async (_event, data: string, defaultName: string) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'webp'] }
      ]
    })
    if (!result.canceled && result.filePath) {
      const buffer = Buffer.from(data, 'base64')
      await writeFile(result.filePath, buffer)
      return { success: true, path: result.filePath }
    }
    return { success: false }
  })
}
