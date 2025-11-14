/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import {ClientFilePortServiceTest} from '@modules/database'
import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * CheckAuth
 *   - ClientFilePort 의 deleteReply 함수 실행을 테스트한다.
 *   - 권한이 없는 유저들이 시도하는 경우를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 파일에 댓글을 하나 생성한다.
 *   - 댓글에 대댓글을 하나 생성한다.
 *   - 이 대댓글에 대해 시도한다.
 *
 * 서브 테스트
 *   1. 권한이 ADMIN_GUEST 인 경우
 *   2. 권한이 ADMIN_USER 인데 대댓글 작성자가 아닌경우
 */
export class CheckAuth extends GKDTestBase {
  private portService = ClientFilePortServiceTest.clientFilePortService

  private replyOId: string = ''
  private commentOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {directory} = this.testDB.getRootDir()
      const fileOId = directory.fileOIdsArr[0]
      const {userOId} = this.testDB.getUserCommon(AUTH_ADMIN).user
      const commentOId = '0'.repeat(24 - this.constructor.name.length) + this.constructor.name
      const replyOId = '0'.repeat(24 - this.constructor.name.length) + this.constructor.name

      const {comment} = await this.testDB.createComment(fileOId, userOId, commentOId, 'test comment')
      this.commentOId = comment.commentOId

      const {reply} = await this.testDB.createReply(commentOId, replyOId, 'test reply', fileOId, userOId, userOId)
      this.replyOId = reply.replyOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_TryGuest.bind(this), db, logLevel)
      await this.memberFail(this._2_TryUser.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.replyOId) {
        await this.testDB.deleteReply(this.replyOId)
      }
      if (this.commentOId) {
        await this.testDB.deleteComment(this.commentOId)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_TryGuest(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_GUEST)
      await this.portService.deleteReply(jwtPayload, this.replyOId)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuth_Reply_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_TryUser(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      await this.portService.deleteReply(jwtPayload, this.replyOId)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuth_Reply_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new CheckAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
