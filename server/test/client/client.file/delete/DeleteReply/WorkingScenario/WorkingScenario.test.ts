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
 *   - ClientFilePort 의 deleteReply 함수 실행을 테스트한다.
 *   - 댓글을 삭제하는 정상적인 시나리오를 테스트한다.
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 테스트 준비
 *   - 루트 폴더에 테스트 파일 1개를 light 버전으로 만든다.
 *   - 테스트 파일에 다음과 같이 댓글을 생성한다.
 *     - 관리자 유저의 댓글 (0번째)
 *       - 관리자 유저의 대댓글 (1번째)
 *       - 일반 유저의 대댓글 (2번째)
 *       - 일반 유저의 대댓글 (3번째)
 *       - 게스트 유저의 대댓글 (4번째)
 *     - 일반 유저의 댓글 (5번째)
 *       - 관리자 유저의 대댓글 (6번째)
 *       - 일반 유저의 대댓글 (7번째)
 *       - 일반 유저의 대댓글 (8번째)
 *       - 게스트 유저의 대댓글 (9번째)
 *   - 댓글 내용 및 대댓글 내용은 test${index} 로 한다.
 *   - 대댓글의 대상은 댓글 작성자로 한다.
 *
 * 시나리오
 *   1. 관리자 유저가 1번째인 대댓글을 삭제한다
 *   2. 일반 유저가 2번째인 대댓글을 삭제한다.
 *   3. 관리자 유저가 3번째인 대댓글을 삭제한다.
 *   4. 관리자 유저가 4번쨰인 대댓글을 삭제한다.
 *   5. 관리자 유저가 6번째인 대댓글을 삭제한다.
 *   6. 일반 유저가 7번째인 대댓글을 삭제한다.
 *   7. 관리자 유저가 8번째인 대댓글을 삭제한다.
 *   8. 관리자 유저가 9번째인 대댓글을 삭제한다.
 *
 * 공통 점검사항
 *   1. 리턴받는 배열 길이가 정확한가?
 *   2. 리턴받는 배열의 순서가 올바른가?
 *     2-1. 각각 본인의 OID 를 체크한다.
 *     2-2. 각각 본인의 content를 확인한다.
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientFilePortServiceTest.clientFilePortService

  private commentOIds = {}
  private fileOId = ''
  private replyOIds = {}

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    // 여기서 fileOId 설정하지 않는다. 파일이 생성이 되었을때만 finishTest 에서 지우게 하기 위함이다.

    for (let i = 0; i < 3; i++) {
      const commentOId = `comment${i}`
      this.commentOIds[`comment${i}`] = '0'.repeat(24 - commentOId.length) + commentOId

      for (let j = 0; j < 4; j++) {
        const replyOId = `reply${i}_${j}`
        this.replyOIds[`reply${i}_${j}`] = '0'.repeat(24 - replyOId.length) + replyOId
      }
    }
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      // 루트 폴더에 테스트 파일을 1개 light 버전으로 만든다.
      const {dirOId} = this.testDB.getRootDir().directory
      const fileName = this.constructor.name
      const fileOId = '0'.repeat(24 - this.constructor.name.length) + this.constructor.name
      const {file} = await this.testDB.createFileLight(dirOId, fileOId, fileName)
      this.fileOId = file.fileOId

      const {userOId: userOIdAdmin} = this.testDB.getUserCommon(AUTH_ADMIN).user
      const {userOId: userOIdUser} = this.testDB.getUserCommon(AUTH_USER).user
      const {userOId: userOIdGuest} = this.testDB.getUserCommon(AUTH_GUEST).user

      // 테스트 파일에 관리자 유저의 댓글과 대댓글을 생성한다.
      await this.testDB.createComment(fileOId, userOIdAdmin, this.commentOIds[`comment0`], 'test0')

      await this.testDB.createReply(this.commentOIds[`comment0`], this.replyOIds[`reply0_0`], 'test0_0', fileOId, userOIdAdmin, userOIdAdmin)
      await this.testDB.createReply(this.commentOIds[`comment0`], this.replyOIds[`reply0_1`], 'test0_1', fileOId, userOIdAdmin, userOIdUser)
      await this.testDB.createReply(this.commentOIds[`comment0`], this.replyOIds[`reply0_2`], 'test0_2', fileOId, userOIdAdmin, userOIdUser)
      await this.testDB.createReply(this.commentOIds[`comment0`], this.replyOIds[`reply0_3`], 'test0_3', fileOId, userOIdAdmin, userOIdGuest)

      // 테스트 파일에 일반 유저의 댓글을 생성한다.
      await this.testDB.createComment(fileOId, userOIdUser, this.commentOIds[`comment1`], 'test1')

      await this.testDB.createReply(this.commentOIds[`comment1`], this.replyOIds[`reply1_0`], 'test1_0', fileOId, userOIdUser, userOIdAdmin)
      await this.testDB.createReply(this.commentOIds[`comment1`], this.replyOIds[`reply1_1`], 'test1_1', fileOId, userOIdUser, userOIdUser)
      await this.testDB.createReply(this.commentOIds[`comment1`], this.replyOIds[`reply1_2`], 'test1_2', fileOId, userOIdUser, userOIdUser)
      await this.testDB.createReply(this.commentOIds[`comment1`], this.replyOIds[`reply1_3`], 'test1_3', fileOId, userOIdUser, userOIdGuest)

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_AdminDeleteReply1.bind(this), db, logLevel)
      await this.memberOK(this._2_UserDeleteReply2.bind(this), db, logLevel)
      await this.memberOK(this._3_AdminDeleteReply3.bind(this), db, logLevel)
      await this.memberOK(this._4_AdminDeleteReply4.bind(this), db, logLevel)
      await this.memberOK(this._5_AdminDeleteReply6.bind(this), db, logLevel)
      await this.memberOK(this._6_UserDeleteReply7.bind(this), db, logLevel)
      await this.memberOK(this._7_AdminDeleteReply8.bind(this), db, logLevel)
      await this.memberOK(this._8_AdminDeleteReply9.bind(this), db, logLevel)
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

  private async _1_AdminDeleteReply1(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 1번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply0_0`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 9) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 9, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'reply', oid: this.replyOIds[`reply0_1`], content: 'test0_1'},
        {type: 'reply', oid: this.replyOIds[`reply0_2`], content: 'test0_2'},
        {type: 'reply', oid: this.replyOIds[`reply0_3`], content: 'test0_3'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_0`], content: 'test1_0'},
        {type: 'reply', oid: this.replyOIds[`reply1_1`], content: 'test1_1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } // ::
        else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_UserDeleteReply2(db: mysql.Pool, logLevel: number) {
    /**
     * 일반 유저가 2번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply0_1`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 8) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 8, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'reply', oid: this.replyOIds[`reply0_2`], content: 'test0_2'},
        {type: 'reply', oid: this.replyOIds[`reply0_3`], content: 'test0_3'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_0`], content: 'test1_0'},
        {type: 'reply', oid: this.replyOIds[`reply1_1`], content: 'test1_1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } // ::
        else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_AdminDeleteReply3(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 3번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply0_2`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 7) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 7, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'reply', oid: this.replyOIds[`reply0_3`], content: 'test0_3'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_0`], content: 'test1_0'},
        {type: 'reply', oid: this.replyOIds[`reply1_1`], content: 'test1_1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } // ::
        else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_AdminDeleteReply4(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 4번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply0_3`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 6) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 6, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_0`], content: 'test1_0'},
        {type: 'reply', oid: this.replyOIds[`reply1_1`], content: 'test1_1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } // ::
        else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_AdminDeleteReply6(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 6번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply1_0`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 5) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 5, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_1`], content: 'test1_1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _6_UserDeleteReply7(db: mysql.Pool, logLevel: number) {
    /**
     * 일반 유저가 7번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply1_1`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 4) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 4, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_2`], content: 'test1_2'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _7_AdminDeleteReply8(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 8번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply1_2`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 3) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 3, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'},
        {type: 'reply', oid: this.replyOIds[`reply1_3`], content: 'test1_3'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _8_AdminDeleteReply9(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저가 9번째인 대댓글을 삭제하는 테스트
     *
     * 공통 점검사항
     *   1. 리턴받는 배열 길이가 정확한가?
     *   2. 리턴받는 배열의 순서가 올바른가?
     *     2-1. 각각 본인의 OID 를 체크한다.
     *     2-2. 각각 본인의 content를 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {commentReplyArr} = await this.portService.deleteReply(jwtPayload, this.replyOIds[`reply1_3`])

      // 1. 리턴받는 배열 길이가 정확한가?
      if (commentReplyArr.length !== 2) {
        throw `1. 리턴받는 배열 길이가 정확한가? 예상: 2, 실제: ${commentReplyArr.length}`
      }

      // 2. 리턴받는 배열의 순서가 올바른가?
      const expectedArr = [
        {type: 'comment', oid: this.commentOIds[`comment0`], content: 'test0'},
        {type: 'comment', oid: this.commentOIds[`comment1`], content: 'test1'}
      ]

      for (let i = 0; i < commentReplyArr.length; i++) {
        const item = commentReplyArr[i]
        const expected = expectedArr[i]

        // 2-1. 각각 본인의 OID 를 체크한다.
        if (expected.type === 'comment') {
          if (!('commentOId' in item) || item.commentOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 commentOId가 ${expected.oid}가 아닌 ${'commentOId' in item ? item.commentOId : '없음'}이다.`
          }
        } else {
          if (!('replyOId' in item) || item.replyOId !== expected.oid) {
            throw `2-1. ${i}번째 원소의 replyOId가 ${expected.oid}가 아닌 ${'replyOId' in item ? item.replyOId : '없음'}이다.`
          }
        }

        // 2-2. 각각 본인의 content를 확인한다.
        if (item.content !== expected.content) {
          throw `2-2. ${i}번째 원소의 content가 ${expected.content}가 아닌 ${item.content}이다.`
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
