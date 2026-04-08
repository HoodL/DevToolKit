import { ipcMain, dialog } from 'electron'
import { getDatabase, saveDatabase } from '../db/database'
import { writeFile, readFile } from 'fs/promises'

interface Bookmark {
  id?: number
  title: string
  url: string
  description: string
  category: string
}

export function registerBookmarkIPC(): void {
  // 获取所有书签
  ipcMain.handle('get-bookmarks', async (_event, search?: string, category?: string) => {
    const db = await getDatabase()
    let sql = 'SELECT * FROM bookmarks WHERE 1=1'
    const params: string[] = []

    if (search) {
      sql += ' AND (title LIKE ? OR url LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }

    sql += ' ORDER BY created_at DESC'
    const stmt = db.prepare(sql)
    stmt.bind(params)

    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  // 添加书签
  ipcMain.handle('add-bookmark', async (_event, bookmark: Bookmark) => {
    const db = await getDatabase()
    db.run(
      'INSERT INTO bookmarks (title, url, description, category) VALUES (?, ?, ?, ?)',
      [bookmark.title, bookmark.url, bookmark.description, bookmark.category]
    )
    saveDatabase()
    const result = db.exec('SELECT last_insert_rowid() as id')
    const id = result[0]?.values[0]?.[0]
    return { success: true, id }
  })

  // 更新书签
  ipcMain.handle('update-bookmark', async (_event, bookmark: Bookmark) => {
    const db = await getDatabase()
    db.run(
      'UPDATE bookmarks SET title=?, url=?, description=?, category=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [bookmark.title, bookmark.url, bookmark.description, bookmark.category, bookmark.id]
    )
    saveDatabase()
    return { success: true }
  })

  // 删除书签
  ipcMain.handle('delete-bookmark', async (_event, id: number) => {
    const db = await getDatabase()
    db.run('DELETE FROM bookmarks WHERE id = ?', [id])
    saveDatabase()
    return { success: true }
  })

  // 分类管理
  ipcMain.handle('get-categories', async () => {
    const db = await getDatabase()
    const stmt = db.prepare('SELECT * FROM categories ORDER BY sort_order, name')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('add-category', async (_event, name: string) => {
    const db = await getDatabase()
    const stmt = db.prepare('SELECT MAX(sort_order) as max FROM categories')
    let maxOrder = 0
    if (stmt.step()) {
      maxOrder = (stmt.getAsObject() as any).max || 0
    }
    stmt.free()
    db.run('INSERT INTO categories (name, sort_order) VALUES (?, ?)', [name, maxOrder + 1])
    saveDatabase()
    const result = db.exec('SELECT last_insert_rowid() as id')
    const id = result[0]?.values[0]?.[0]
    return { success: true, id }
  })

  ipcMain.handle('delete-category', async (_event, id: number) => {
    const db = await getDatabase()
    db.run('DELETE FROM categories WHERE id = ?', [id])
    saveDatabase()
    return { success: true }
  })

  // 导出书签
  ipcMain.handle('export-bookmarks', async () => {
    const db = await getDatabase()
    const stmt = db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC')
    const bookmarks: any[] = []
    while (stmt.step()) {
      bookmarks.push(stmt.getAsObject())
    }
    stmt.free()

    const result = await dialog.showSaveDialog({
      defaultPath: 'bookmarks.json',
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (!result.canceled && result.filePath) {
      await writeFile(result.filePath, JSON.stringify(bookmarks, null, 2), 'utf-8')
      return { success: true, path: result.filePath }
    }
    return { success: false }
  })

  // 导入书签
  ipcMain.handle('import-bookmarks', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (!result.canceled && result.filePaths.length > 0) {
      const db = await getDatabase()
      const content = await readFile(result.filePaths[0], 'utf-8')
      const bookmarks = JSON.parse(content)
      for (const item of bookmarks) {
        db.run(
          'INSERT INTO bookmarks (title, url, description, category) VALUES (?, ?, ?, ?)',
          [item.title, item.url, item.description || '', item.category || '']
        )
      }
      saveDatabase()
      return { success: true, count: bookmarks.length }
    }
    return { success: false }
  })
}
