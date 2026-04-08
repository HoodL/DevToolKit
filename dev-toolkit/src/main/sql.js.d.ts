declare module 'sql.js' {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number | Buffer>) => Database
  }

  interface Database {
    run(sql: string, params?: any[]): Database
    exec(sql: string, params?: any[]): { columns: string[]; values: any[][] }[]
    prepare(sql: string, params?: any[]): Statement
    export(): Uint8Array
    close(): void
  }

  interface Statement {
    bind(params?: any[] | Record<string, any>): boolean
    step(): boolean
    getAsObject(params?: any[]): Record<string, any>
    free(): boolean
    get(params?: any[]): any[]
  }

  export type { Database, Statement }
  export default function initSqlJs(config?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>
}
