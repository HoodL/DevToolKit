import { contextBridge, ipcRenderer } from 'electron'
const LunarCalendar = (() => {
  try { return require('lunar-calendar') } catch { return null }
})()

const api = {
  // 图片
  selectImages: () => ipcRenderer.invoke('select-images'),
  saveCompressedImage: (data: string, defaultName: string) =>
    ipcRenderer.invoke('save-compressed-image', data, defaultName),

  // 书签
  getBookmarks: (search?: string, category?: string) =>
    ipcRenderer.invoke('get-bookmarks', search, category),
  addBookmark: (bookmark: any) => ipcRenderer.invoke('add-bookmark', bookmark),
  updateBookmark: (bookmark: any) => ipcRenderer.invoke('update-bookmark', bookmark),
  deleteBookmark: (id: number) => ipcRenderer.invoke('delete-bookmark', id),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (name: string) => ipcRenderer.invoke('add-category', name),
  deleteCategory: (id: number) => ipcRenderer.invoke('delete-category', id),
  exportBookmarks: () => ipcRenderer.invoke('export-bookmarks'),
  importBookmarks: () => ipcRenderer.invoke('import-bookmarks'),

  // 农历转换
  solarToLunar: (y: number, m: number, d: number) => {
    if (!LunarCalendar) return null
    return LunarCalendar.solarToLunar(y, m, d)
  },

  // 通用
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url)
}

export type ElectronAPI = typeof api

contextBridge.exposeInMainWorld('api', api)
