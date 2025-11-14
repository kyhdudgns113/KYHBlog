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
import {AUTH_ADMIN, AUTH_USER, AUTH_GUEST} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - ClientFilePort 의 deleteComment 함수 실행을 테스트한다.
 *   - 댓글을 삭제하는 정상적인 시나리오를 테스트한다.
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 테스트 준비
 *   - 루트 폴더에 테스트 파일 1개를 light 버전으로 만든다.
 *   - 테스트 파일에 다음과 같이 댓글을 생성한다.
 *     - 관리자 유저의 댓글 2개
 *     - 일반 유저의 댓글 2개
 *     - 게스트 유저의 댓글 2개
 *
 * 시나리오
 *   1. 일반 유저가 본인이 작성한 댓글을 삭제한다.
 *   2. 관리자 유저가 일반 유저가 작성한 댓글을 삭제한다.
 *   3. 관리자 유저가 본인이 작성한 댓글을 삭제한다.
 *   4. 관리자 유저가 게스트 유저의 댓글을 삭제한다.
 *
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientFilePortServiceTest.clientFilePortService

  private commentOIds = {}
  private fileOId = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      // 루트 폴더에 테스트 파일 1개를 light 버전으로 만든다.
      const {dirOId} = this.testDB.getRootDir().directory
      const fileName = this.constructor.name
      const fileOId = '0'.repeat(24 - this.constructor.name.length) + this.constructor.name
      const {file} = await this.testDB.createFileLight(dirOId, fileOId, fileName)
      this.fileOId = file.fileOId

      // 테스트 파일에 관리자 유저의 댓글 2개를 생성한다.
      const {userOId: userOIdRoot} = this.testDB.getUserCommon(AUTH_ADMIN).user
      const commentOIdRoot0 = '0'.repeat(19) + 'root0'
      const commentOIdRoot1 = '0'.repeat(19) + 'root1'
      await this.testDB.createComment(fileOId, userOIdRoot, commentOIdRoot0, 'comment0')
      await this.testDB.createComment(fileOId, userOIdRoot, commentOIdRoot1, 'comment1')
      this.commentOIds[`root0`] = commentOIdRoot0
      this.commentOIds[`root1`] = commentOIdRoot1

      // 테스트 파일에 일반 유저의 댓글 2개를 생성한다.
      const {userOId: userOIdUser} = this.testDB.getUserCommon(AUTH_USER).user
      const commentOIdUser0 = '0'.repeat(19) + 'user0'
      const commentOIdUser1 = '0'.repeat(19) + 'user1'
      await this.testDB.createComment(fileOId, userOIdUser, commentOIdUser0, 'comment0')
      await this.testDB.createComment(fileOId, userOIdUser, commentOIdUser1, 'comment1')
      this.commentOIds[`user0`] = commentOIdUser0
      this.commentOIds[`user1`] = commentOIdUser1
      // 테스트 파일에 게스트 유저의 댓글 2개를 생성한다.
      const {userOId: userOIdGuest} = this.testDB.getUserCommon(AUTH_GUEST).user
      const commentOIdGuest0 = '0'.repeat(18) + 'guest0'
      const commentOIdGuest1 = '0'.repeat(18) + 'guest1'
      await this.testDB.createComment(fileOId, userOIdGuest, commentOIdGuest0, 'comment0')
      await this.testDB.createComment(fileOId, userOIdGuest, commentOIdGuest1, 'comment1')
      this.commentOIds[`guest0`] = commentOIdGuest0
      this.commentOIds[`guest1`] = commentOIdGuest1
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_UserDeleteOwnComment.bind(this), db, logLevel)
      await this.memberOK(this._2_AdminDeleteUserComment.bind(this), db, logLevel)
      await this.memberOK(this._3_AdminDeleteOwnComment.bind(this), db, logLevel)
      await this.memberOK(this._4_AdminDeleteGuestComment.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.fileOId) {
        await this.testDB.deleteFileLight(this.fileOId)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_UserDeleteOwnComment(db: mysql.Pool, logLevel: number) {
    /**
     * 일반 유저가 본인의 댓글을 삭제하는 테스트
     *
     * 점검사항
     *   1. 댓글 배열 길이가 5인가?
     *   2. 댓글 배열의 순서가 올바른가?
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      const {commentReplyArr} = await this.portService.deleteComment(jwtPayload, this.commentOIds[`user0`])

      // 1. 댓글 배열 길이가 5인가?
      if (commentReplyArr.length !== 5) {
        throw `1. 댓글 배열 길이가 5인가? ${commentReplyArr.length}`
      }
      // 2. 댓글 배열의 순서가 올바른가?
      const keyArr = ['root0', 'root1', 'user1', 'guest0', 'guest1']
      for (let i = 0; i < commentReplyArr.length; i++) {
        if (commentReplyArr[i].commentOId !== this.commentOIds[keyArr[i]]) {
          throw `2. 댓글 배열의 ${i}번째 원소가 ${this.commentOIds[keyArr[i]]} 이 아닌 ${commentReplyArr[i].commentOId} 이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_AdminDeleteUserComment(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 일반 유저가 작성한 댓글을 삭제하는 테스트
     *
     * 점검사항
     *   1. 댓글 배열 길이가 4인가?
     *   2. 댓글 배열의 순서가 올바른가?
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteComment(jwtPayload, this.commentOIds[`user1`])

      // 1. 댓글 배열 길이가 4인가?
      if (commentReplyArr.length !== 4) {
        throw `1. 댓글 배열 길이가 4인가? ${commentReplyArr.length}`
      }
      // 2. 댓글 배열의 순서가 올바른가?
      const keyArr = ['root0', 'root1', 'guest0', 'guest1']
      for (let i = 0; i < commentReplyArr.length; i++) {
        if (commentReplyArr[i].commentOId !== this.commentOIds[keyArr[i]]) {
          throw `2. 댓글 배열의 ${i}번째 원소가 ${this.commentOIds[keyArr[i]]} 이 아닌 ${commentReplyArr[i].commentOId} 이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_AdminDeleteOwnComment(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 본인이 작성한 댓글을 삭제하는 테스트
     *
     * 점검사항
     *   1. 댓글 배열 길이가 3인가?
     *   2. 댓글 배열의 순서가 올바른가?
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteComment(jwtPayload, this.commentOIds[`root0`])

      // 1. 댓글 배열 길이가 3인가?
      if (commentReplyArr.length !== 3) {
        throw `1. 댓글 배열 길이가 3인가? ${commentReplyArr.length}`
      }
      // 2. 댓글 배열의 순서가 올바른가?
      const keyArr = ['root1', 'guest0', 'guest1']
      for (let i = 0; i < commentReplyArr.length; i++) {
        if (commentReplyArr[i].commentOId !== this.commentOIds[keyArr[i]]) {
          throw `2. 댓글 배열의 ${i}번째 원소가 ${this.commentOIds[keyArr[i]]} 이 아닌 ${commentReplyArr[i].commentOId} 이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_AdminDeleteGuestComment(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 게스트 유저의 댓글을 삭제하는 테스트
     *
     * 점검사항
     *   1. 댓글 배열 길이가 2인가?
     *   2. 댓글 배열의 순서가 올바른가?
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteComment(jwtPayload, this.commentOIds[`guest0`])

      // 1. 댓글 배열 길이가 2인가?
      if (commentReplyArr.length !== 2) {
        throw `1. 댓글 배열 길이가 2인가? ${commentReplyArr.length}`
      }
      // 2. 댓글 배열의 순서가 올바른가?
      const keyArr = ['root1', 'guest1']
      for (let i = 0; i < commentReplyArr.length; i++) {
        if (commentReplyArr[i].commentOId !== this.commentOIds[keyArr[i]]) {
          throw `2. 댓글 배열의 ${i}번째 원소가 ${this.commentOIds[keyArr[i]]} 이 아닌 ${commentReplyArr[i].commentOId} 이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WorkingScenario(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
