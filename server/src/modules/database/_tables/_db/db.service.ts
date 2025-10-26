import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common'
import {mysqlHost, mysqlID, mysqlPW, mysqlDB, mysqlTestDB, mysqlTestPW, mysqlTestID, mysqlTestHost, mysqlTestPort, mysqlPort} from '@secret'

import * as mysql from 'mysql2/promise'

@Injectable()
export class DBService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool
  private isTest: boolean

  constructor(isTest?: boolean) {
    this.isTest = isTest ?? false

    if (isTest) {
      this.pool = mysql.createPool({
        host: mysqlTestHost,
        user: mysqlTestID,
        password: mysqlTestPW,
        database: mysqlTestDB,
        port: mysqlTestPort,
        waitForConnections: true,
        connectionLimit: 100, // 동시에 열 수 있는 연결 수 증가
        queueLimit: 100, // 대기열 제한 추가
        multipleStatements: true
      })
    }
  }

  async onModuleInit() {
    if (!this.isTest) {
      this.pool = mysql.createPool({
        host: mysqlHost,
        user: mysqlID,
        password: mysqlPW,
        database: mysqlDB,
        port: mysqlPort,
        waitForConnections: true,
        connectionLimit: 100, // 연결 수 증가
        queueLimit: 100, // 대기열 제한 추가
        multipleStatements: true,
        // 연결 풀 초과 시 에러 대신 대기하도록 설정
        idleTimeout: 300000, // 5분
        maxIdle: 10, // 최대 유휴 연결 수
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      })
    }

    // 풀 연결 테스트
    await this.pool.getConnection().then(conn => conn.release())
    console.log('\n  DB pool created & connected  \n')
  }

  async onModuleDestroy() {
    await this.pool.end()
    console.log('\n  DB pool closed  \n')
  }

  /**
   * 풀 자체 반환
   */
  getPool(): mysql.Pool {
    return this.pool
  }

  /**
   * 커넥션 1개 얻기
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      return await this.pool.getConnection()
      // ::
    } catch (error) {
      // ::
      console.error('getConnection 실패:', error.message)
      throw error
    }
  }

  /**
   * 안전한 쿼리 실행 (연결 풀 초과 시 대기)
   */
  async safeQuery(sql: string, params: any[]): Promise<any> {
    let connection: mysql.PoolConnection | null = null

    try {
      // 연결 획득 시도 (타임아웃 포함)
      connection = await Promise.race([
        this.pool.getConnection(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('DB 연결 획득 타임아웃')), 30000))
      ])

      const [rows] = await connection.execute(sql, params)
      return rows
      // ::
    } catch (error) {
      // ::
      console.error('safeQuery 실행 실패:', error.message)
      // ::
      throw error
      // ::
    } finally {
      // ::
      if (connection) {
        connection.release()
      }
    }
  }
}
