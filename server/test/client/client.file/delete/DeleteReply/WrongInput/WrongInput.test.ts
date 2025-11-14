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
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - ClientFilePort 의 deleteReply 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 테스트 준비
 *   - 파일에 댓글을 하나 생성한다.
 *   - 댓글에 대댓글을 하나 생성한다.
 *   - 이 대댓글에 대해 시도한다.
 *
 * 서브 테스트
 *   1. 존재하지 않는 대댓글을 지우려는 경우
 *   2. 이미 지워진 대댓글을 지우려는 경우
 *     - 준비단계에서 만든 대댓글을 지운다.
 *     - 따라서 이 테스트는 가장 마지막에 실행되어야 한다.
 */
export class WrongInput extends GKDTestBase {
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
      await this.memberFail(this._1_DeleteNonExistentReply.bind(this), db, logLevel)
      await this.memberFail(this._2_DeleteAlreadyDeletedReply.bind(this), db, logLevel)
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

  private async _1_DeleteNonExistentReply(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const nonExistentReplyOId = '0'.repeat(24)
      await this.portService.deleteReply(jwtPayload, nonExistentReplyOId)
      // ::
    } catch (errObj) {
      // ::
      // 대댓글 권한 검증하려할때 대댓글이 존재하지 않으므로 권한인증이 실패한다.
      if (errObj.gkdErrCode !== 'DBHUB_checkAuth_Reply_noReply') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_DeleteAlreadyDeletedReply(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      try {
        await this.portService.deleteReply(jwtPayload, this.replyOId)
        // ::
      } catch (errObj) {
        // ::
        this.addFinalLog(`[DeleteReply] WrongInput/ 2번째 테스트에서 첫번째 대댓글 삭제할때 에러가 발생했다.`, consoleColors.FgRed)
        return this.logErrorObj(errObj, 2)
      }

      await this.portService.deleteReply(jwtPayload, this.replyOId)
      // ::
    } catch (errObj) {
      // ::
      // 대댓글 권한 검증하려할때 대댓글이 존재하지 않으므로 권한인증이 실패한다.
      if (errObj.gkdErrCode !== 'DBHUB_checkAuth_Reply_noReply') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongInput(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
