/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'

import {LoadChatArrFunction} from './loadChatArr'
import {LoadChatRoomArrFunction} from './loadChatRoomArr'
import {LoadUserChatRoomFunction} from './loadUserChatRoom'
import {consoleColors} from '@util'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientChatModule extends GKDTestBase {
  private readonly LoadChatArrFunction: LoadChatArrFunction
  private readonly LoadChatRoomArrFunction: LoadChatRoomArrFunction
  private readonly LoadUserChatRoomFunction: LoadUserChatRoomFunction

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.LoadChatArrFunction = new LoadChatArrFunction(REQUIRED_LOG_LEVEL + 1)
    this.LoadChatRoomArrFunction = new LoadChatRoomArrFunction(REQUIRED_LOG_LEVEL + 1)
    this.LoadUserChatRoomFunction = new LoadUserChatRoomFunction(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.LoadChatArrFunction.testOK(db, logLevel)
      await this.LoadChatRoomArrFunction.testOK(db, logLevel)
      await this.LoadUserChatRoomFunction.testOK(db, logLevel)

      const {FgGreen} = consoleColors
      this.addFinalLog(`[ClientChatModule] 함수 3개 테스트 완료`, FgGreen)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new ClientChatModule(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
