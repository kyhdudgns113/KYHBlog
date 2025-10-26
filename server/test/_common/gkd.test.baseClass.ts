import os from 'os'
import * as mysql from 'mysql2/promise'

import {mysqlTestHost, mysqlTestID, mysqlTestPW, mysqlTestDB} from '@secret'
import {consoleColors} from '@util'
import {TestDB} from '@testCommon'

type TestFunctionType = (db: mysql.Pool, logLevel: number) => Promise<void>

/**
 * 테스트용 데이터를 만드는건 여기서 넣어주지 않는다 \
 * 테스트 데이터의 규모를 바꿔가며 할 필요가 생길 수 있다 \
 * 테스트 DB 생성 클래스를 따로 만들자
 */
export abstract class GKDTestBase {
  private isDbCreated = false

  protected testDB = new TestDB()
  protected db: mysql.Pool = null

  protected logLevel = 0

  private static finalLogs: string[] = []
  private trace: string = ''

  /**
   * @param REQUIRED_LOG_LEVEL 이 테스트 클래스의 로그를 출력하기 위한 레벨이다.
   */
  constructor(protected REQUIRED_LOG_LEVEL: number) {}

  /**
   * execTest 를 하기전에 초기화나 테스트 데이터를 만드는 함수.\
   * execTest 호출 이전에 호출된다.\
   * C 에서 malloc 하는 공간이라 생각하면 된다.
   *
   * @param db 테스트에 사용할 db 변수. 그대로 넣어주면 된다.
   * @param logLevel 테스트가 출력할 로그 레벨. 이 레벨까지의 로그만 출력한다.\
   * 이 변수 역시 웬만하면 그대로 넣어주면 된다.
   */
  protected abstract beforeTest(db: mysql.Pool, logLevel: number): Promise<void>
  /**
   * 실제로 테스트를 할 함수를 작성하는 공간이다.
   *
   * @param db 테스트에 사용할 db 변수. 그대로 넣어주면 된다.
   * @param logLevel 테스트가 출력할 로그 레벨. 이 레벨까지의 로그만 출력한다.\
   * 이 변수 역시 웬만하면 그대로 넣어주면 된다.
   */
  protected abstract execTest(db: mysql.Pool, logLevel: number): Promise<void>
  /**
   * beforeTest 에서 설정했던 값들을 원래대로 돌려놓는 공간 \
   * exceTest 이후에 실행된다. \
   * C 에서 free 하는 공간이라 생각하면 된다.
   */
  protected abstract finishTest(db: mysql.Pool, logLevel: number): Promise<void>

  /**
   * DO NOT OVERRIDE
   *
   * 이 클래스나 모듈이 throw 를 해야 성공일때 호출한다.
   *
   * @param db 테스트에 사용할 db 변수. 그대로 넣어주면 된다.
   * @param logLevel 테스트가 출력할 로그 레벨. 이 레벨까지의 로그만 출력한다.\
   * 이 변수 역시 웬만하면 그대로 넣어주면 된다.
   */
  public testFail = async (db: mysql.Pool, logLevel: number) => {
    // 이게 true 이면 엄한데서 에러가 떴다는 뜻이다.
    let throwErr = false

    try {
      // 초기화 및 beforeTest 를 실행한다.
      try {
        // 이거 먼저 실행해야 logLevel 제대로 입력된다.
        // 그래야 로그가 제대로 출력됨.
        await this._initValues(db, logLevel)
        this._loggingMessage(`실행...`, 0, false)
        await this.beforeTest(db, logLevel)
        // ::
      } catch (errObj) {
        // 여기서 에러가 나는건 정상작동이 아니므로 이를 알린다.
        // ::
        throwErr = true
        this._loggingMessage(`이 _init 이나 before 에서 실패하면 안되지...`, 0, true)
        throw errObj
      }

      // 테스트를 실행한다. 여기서 err 를 throw 해야 정상작동이다.
      await this.execTest(db, logLevel)

      // err 를 throw 하지 않았으므로 비정상임을 알린다.
      throwErr = true
      this._loggingMessage(`이 완료되면 안되지...`, 0, true)
      throw `${this.constructor.name}: 이 완료되면 안되지...;;;`
      // ::
    } catch (errObj) {
      // ::
      // 1. before 에서 에러가 뜬 경우
      // 2. 에러가 정상적으로 검출되지 않은 경우
      if (throwErr === true) {
        if (typeof errObj === 'string') {
          errObj = `${this.trace}/ ${errObj}`
        }
        throw errObj
      }

      // 이것 역시
      if (!errObj.gkdErrCode) {
        this._loggingMessage(`예기치 못한 에러 발생`, 0, true)
        if (typeof errObj === 'string') {
          errObj = `${this.trace}/ ${errObj}`
        }
        throw errObj
      }
      // 그게 아니면 catch 문으로 넘어오는게 정상이다.
      this._loggingMessage(`완료!!!`, 0, true)
      // ::
    } finally {
      // ::
      try {
        // finishTest 를 실행한다.
        await this.finishTest(db, logLevel)

        // 이 클래스를 상속받은 클래스에서 초기DB 만든거면 여기서 DB 제거한다.
        if (this.isDbCreated) {
          await this.testDB.cleanUpDB()
          this._printFinalLogs()
        }
        // ::
      } catch (errObj) {
        // ::
        // 여기서 에러가 뜨면 안된다.
        console.log(`${this.constructor.name}: 왜 여기 finally 에서 터지냐???`)
        throw errObj
      }
    }
  }
  /**
   * DO NOT OVERRIDE
   *
   * 이 클래스나 모듈이 throw 하지 않고 정상적으로 끝마치는 경우에 쓴다. \
   *
   * @param db 테스트에 사용할 db 변수. 그대로 넣어주면 된다.
   * @param logLevel 테스트가 출력할 로그 레벨. 이 레벨까지의 로그만 출력한다.\
   * 이 변수 역시 웬만하면 그대로 넣어주면 된다.
   */
  public testOK = async (db: mysql.Pool, logLevel: number) => {
    try {
      // 이거 먼저 실행해야 logLevel 제대로 입력된다.
      // 그래야 로그가 제대로 출력됨.
      await this._initValues(db, logLevel)
      this._loggingMessage(`실행...`, 0, false)

      try {
        await this.beforeTest(this.db, logLevel)
        // ::
      } catch (errObj) {
        // ::
        this._loggingMessage(`이 _init 이나 before 에서 실패하면 안되지...`, 0, true)
        throw errObj
      }

      await this.execTest(this.db, logLevel)
      this._loggingMessage(`완료!!!`, 0, true)
      // ::
    } catch (errObj) {
      // ::
      if (typeof errObj === 'string') {
        errObj = `${this.trace}/ ${errObj}`
      }
      throw errObj
      // ::
    } finally {
      // ::
      try {
        await this.finishTest(db, logLevel)
        if (this.isDbCreated) {
          await this.testDB.cleanUpDB()
          this._printFinalLogs()
        }
        // ::
      } catch (errObj) {
        // ::
        console.log(`${this.constructor.name} 왜 여기 finally 에서 터지냐???`)
        throw errObj
      }
    }
  }

  /**
   * 넘겨받은 errObj 를 출력한다.
   *   - 잘못된 에러 오브젝트가 나왔다던가 할 때 출력한다
   */
  protected logErrorObj = (errObj: any, addLevel: number = 0) => {
    const reqLogLevel = this.REQUIRED_LOG_LEVEL + addLevel
    const tabString = Array(reqLogLevel)
      .fill(null)
      .map(_ => '  ')
      .join('')

    const modVal = reqLogLevel % 5
    const modTabVal = (reqLogLevel + 1) % 5

    const {Reset, FgCyan, FgGreen, FgMagenta, FgYellow} = consoleColors
    const colorArr = ['', FgGreen, FgMagenta, FgCyan, FgYellow]
    const setColor = colorArr[modVal]
    const setTabColor = colorArr[modTabVal]

    if (this.logLevel >= reqLogLevel) {
      const keyValList = ['gkd', 'gkdStatus']

      console.log(setColor)
      console.log(tabString + `- ${this.constructor.name}: ` + '이상한 에러 오브젝트 출현')
      console.log(tabString + `- ${this.constructor.name}: ` + errObj)
      if (typeof errObj !== 'string') {
        Object.keys(errObj).forEach(key => {
          console.log(tabString + `- ${this.constructor.name}: [${key}]: ${errObj[key]}`)

          process.stdout.write(Reset)
          if (keyValList.includes(key)) {
            process.stdout.write(setTabColor)
            Object.keys(errObj[key]).forEach(_key => {
              console.log(tabString + `- ${this.constructor.name}:     [${_key}]: ${errObj[key][_key]}`)
            })
          }
          process.stdout.write(setColor)
        })
      }
      console.log(Reset)
    }
  }

  /**
   * 로깅 메시지를 띄운다. 현재 테스트의 로그레벨에 addLevel 을 더한다.\
   *   - 상속받은 클래스 내에서만 쓰이도록 protected 선언을 했다.
   */
  protected logMessage = (message: string, addLevel: number = 0) => {
    const reqLogLevel = this.REQUIRED_LOG_LEVEL + addLevel
    const tabString = Array(reqLogLevel)
      .fill(null)
      .map(_ => '  ')
      .join('')
    const totalMsg = tabString + `- ${this.constructor.name}: ` + message

    const modVal = reqLogLevel % 5

    const {Reset, FgCyan, FgGreen, FgMagenta, FgYellow} = consoleColors
    const colorArr = ['', FgGreen, FgMagenta, FgCyan, FgYellow]
    const setColor = colorArr[modVal]

    this.logLevel >= reqLogLevel && console.log(setColor, totalMsg, Reset)
  }

  /**
   * 테스트 종료 후 로그를 출력하기 위해 추가하는 함수
   */
  protected addFinalLog = (log: string, colorStr: string = '') => {
    const {Reset} = consoleColors

    GKDTestBase.finalLogs.push(colorStr + log + Reset)
  }

  /**
   * 멤버 함수인 callback 함수가 정상적으로 터지는지 확인하는 함수이다.\
   * 로그 메시지를 출력하기 위함이며, 굳이 이거 안써도 무방하다.
   *
   * @param callback : callback.bind(this) 로 넣어줘야 한다. 그래야 this 를 사용할 수 있음.
   * @param db : 그대로 넣어준다
   * @param logLevel : 그대로 넣어준다.
   */
  protected memberFail = async (callback: TestFunctionType, db: mysql.Pool, logLevel: number, addLevel: number = 0) => {
    let throwErr = false
    const name = callback.name.split('bound')[1]

    try {
      this._loggingMessageFunc(`실행...`, 1 + addLevel, false, name)
      await callback(db, logLevel)

      throwErr = true
      this._loggingMessageFunc(`이 완료되면 안되용 ㅠㅠㅠ`, 1 + addLevel, true, name)
      throw `${name}: 이 완료되면 안되용 ㅠㅠㅠ`
      // ::
    } catch (errObj) {
      // ::
      // 1. before 에서 에러가 뜬 경우
      // 2. 에러가 정상적으로 검출되지 않은 경우
      if (throwErr) {
        if (typeof errObj === 'string') {
          errObj = `${name}/ ${errObj}`
        }
        throw errObj
      }

      // 테스트중 예상되지 않은 에러가 뜨는 경우
      if (!errObj.gkdErrCode) {
        this._loggingMessageFunc(`예기치 못한 에러 발생`, 1 + addLevel, true, name)
        if (typeof errObj === 'string') {
          errObj = `${name}/ ${errObj}`
        }
        throw errObj
      }
      this._loggingMessageFunc(`완료!!`, 1 + addLevel, true, name)
    }
  }
  /**
   * 멤버 함수인 callback 함수가 정상적으로 마쳐지는지 확인하는 함수이다.\
   * 로그 메시지를 출력하기 위함이며, 굳이 이거 안써도 무방하다.
   *
   * @param callback : callback.bind(this) 로 넣어줘야 한다. 그래야 this 를 사용할 수 있음.
   * @param db : 그대로 넣어준다
   * @param logLevel : 그대로 넣어준다.
   */
  protected memberOK = async (callback: TestFunctionType, db: mysql.Pool, logLevel: number, addLevel: number = 0) => {
    const name = callback.name.split('bound ')[1]

    try {
      this._loggingMessageFunc(`실행...`, 1 + addLevel, false, name)
      await callback(db, logLevel)
      this._loggingMessageFunc(`완료!!!`, 1 + addLevel, true, name)
      // ::
    } catch (errObj) {
      // ::
      if (typeof errObj === 'string') {
        errObj = `${name}/ ${errObj}`
      }
      throw errObj
    }
  }

  /**
   * contructor 붙인 로그 메시지를 띄운다.
   * @param message : 출력할 기본 메시지
   * @param addLevel : 추가할 로그 레벨
   * @param finished : true
   */
  private _loggingMessage(message: string, addLevel: number, finished: boolean) {
    const reqLogLevel = this.REQUIRED_LOG_LEVEL + addLevel
    const tabString = Array(reqLogLevel)
      .fill(null)
      .map(_ => '  ')
      .join('')
    const frontMsg = tabString + `- ${this.constructor.name}: `
    const totalMsg = frontMsg + message

    const modVal = reqLogLevel % 5

    const {Reset, FgCyan, FgGreen, FgMagenta, FgYellow} = consoleColors
    const colorArr = ['', FgGreen, FgMagenta, FgCyan, FgYellow]
    const setColor = colorArr[modVal]

    const isEndNode = this.logLevel === reqLogLevel

    if (isEndNode && !finished) {
      // 개행 안하려고 write 함수 쓴 것 같다.
      process.stdout.write(`${setColor}${frontMsg}${Reset}`)
    } // ::
    else if (isEndNode && finished) {
      process.stdout.write(`${setColor}${message}${Reset}\n`)
    } // ::
    else {
      if (this.logLevel >= reqLogLevel) {
        console.log(setColor, totalMsg, Reset)
      }
    }
  }
  /**
   * name(함수이름) 붙인 로그 메시지를 띄운다.
   * @param message : 출력할 기본 메시지
   * @param addLevel : 추가할 로그 레벨
   * @param finished : true
   * @param name: 함수 이름
   */
  private _loggingMessageFunc(message: string, addLevel: number, finished: boolean, name: string) {
    const reqLogLevel = this.REQUIRED_LOG_LEVEL + addLevel
    const tabString = Array(reqLogLevel)
      .fill(null)
      .map(_ => '  ')
      .join('')
    const frontMsg = tabString + `- ${name}: ` // 왠지 모르게 공백이 하나 있어야 한다.
    const totalMsg = frontMsg + message

    const modVal = reqLogLevel % 5

    const {Reset, FgCyan, FgGreen, FgMagenta, FgYellow} = consoleColors
    const colorArr = ['', FgGreen, FgMagenta, FgCyan, FgYellow]
    const setColor = colorArr[modVal]

    const isEndNode = this.logLevel === reqLogLevel

    if (isEndNode && !finished) {
      // 개행 안하려고 write 함수 쓴 것 같다.
      process.stdout.write(`${setColor}${frontMsg}${Reset}`)
    } // ::
    else if (isEndNode && finished) {
      process.stdout.write(`${setColor}${message}${Reset}\n`)
    } // ::
    else {
      this.logLevel >= reqLogLevel && console.log(setColor, totalMsg, Reset)
    }
  }
  private async _initValues(db: mysql.Pool, logLevel: number) {
    try {
      if (db === null) {
        this.isDbCreated = true
        this.db = await mysql.createPool({
          host: mysqlTestHost,
          user: mysqlTestID,
          password: mysqlTestPW,
          database: mysqlTestDB,
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
      } // ::
      else {
        this.db = db
      }
      this.logLevel = logLevel
      this.trace = this.constructor.name

      await this.testDB.initTestDB(this.db)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _printFinalLogs() {
    console.log(`\n\n${GKDTestBase.finalLogs.length} 개의 저장된 로그가 있습니다.\n`)
    GKDTestBase.finalLogs.forEach((log, idx) => {
      console.log(`  ${idx + 1}. ${log}`)
    })
    console.log(' ')
  }
}
