/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'

import * as DELETE from './delete'
import * as GET from './get'
import * as POST from './post'
import * as PUT from './put'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientFileModule extends GKDTestBase {
  private readonly deleteCommentFunction: DELETE.DeleteCommentFunction
  private readonly deleteReplyFunction: DELETE.DeleteReplyFunction

  private readonly loadCommentsFunction: GET.LoadCommentsFunction
  private readonly loadFileFunction: GET.LoadFileFunction
  private readonly loadNoticeFileFunction: GET.LoadNoticeFileFunction

  private readonly addCommentFunction: POST.AddCommentFunction
  private readonly addReplyFunction: POST.AddReplyFunction

  private readonly editCommentFunction: PUT.EditCommentFunction
  private readonly editReplyFunction: PUT.EditReplyFunction
  private readonly editFileFunction: PUT.EditFileFunction
  private readonly editFileStatusFunction: PUT.EditFileStatusFunction

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.deleteCommentFunction = new DELETE.DeleteCommentFunction(REQUIRED_LOG_LEVEL + 1)
    this.deleteReplyFunction = new DELETE.DeleteReplyFunction(REQUIRED_LOG_LEVEL + 1)

    this.loadCommentsFunction = new GET.LoadCommentsFunction(REQUIRED_LOG_LEVEL + 1)
    this.loadFileFunction = new GET.LoadFileFunction(REQUIRED_LOG_LEVEL + 1)
    this.loadNoticeFileFunction = new GET.LoadNoticeFileFunction(REQUIRED_LOG_LEVEL + 1)

    this.addCommentFunction = new POST.AddCommentFunction(REQUIRED_LOG_LEVEL + 1)
    this.addReplyFunction = new POST.AddReplyFunction(REQUIRED_LOG_LEVEL + 1)

    this.editCommentFunction = new PUT.EditCommentFunction(REQUIRED_LOG_LEVEL + 1)
    this.editReplyFunction = new PUT.EditReplyFunction(REQUIRED_LOG_LEVEL + 1)
    this.editFileFunction = new PUT.EditFileFunction(REQUIRED_LOG_LEVEL + 1)
    this.editFileStatusFunction = new PUT.EditFileStatusFunction(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.deleteCommentFunction.testOK(db, logLevel)
      await this.deleteReplyFunction.testOK(db, logLevel)

      await this.loadCommentsFunction.testOK(db, logLevel)
      await this.loadFileFunction.testOK(db, logLevel)
      await this.loadNoticeFileFunction.testOK(db, logLevel)

      await this.addCommentFunction.testOK(db, logLevel)
      await this.addReplyFunction.testOK(db, logLevel)

      await this.editCommentFunction.testOK(db, logLevel)
      await this.editReplyFunction.testOK(db, logLevel)
      await this.editFileFunction.testOK(db, logLevel)
      await this.editFileStatusFunction.testOK(db, logLevel)

      this.addFinalLog(`[ClientFileModule] 함수 12개 테스트 작성중 0/12`, consoleColors.FgYellow)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {}
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new ClientFileModule(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
