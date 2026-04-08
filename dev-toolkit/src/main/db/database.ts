import { app } from 'electron'
import { join } from 'path'
import initSqlJs, { Database } from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'

let db: Database | null = null
let dbPath: string

function getDbPath(): string {
  if (!dbPath) {
    dbPath = join(app.getPath('userData'), 'dev-toolkit.db')
  }
  return dbPath
}

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs()
  const path = getDbPath()

  if (existsSync(path)) {
    const buffer = readFileSync(path)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  initTables(db)
  return db
}

export function saveDatabase(): void {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(getDbPath(), buffer)
}

function initTables(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  saveDatabase()
}
