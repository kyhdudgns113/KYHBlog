import {RowDataPacket} from 'mysql2/promise'
import {CHAT_ROOM_STATUS_ACTIVE, CHAT_ROOM_STATUS_INACTIVE} from '@commons/values'
import {AUTH_VAL_ARR, AUTH_GUEST, gkdSaltOrRounds, AUTH_USER, AUTH_ADMIN, FILE_NORMAL} from '@secret'

import * as bcrypt from 'bcrypt'
import * as mysql from 'mysql2/promise'
import * as DTO from '@dto'
import * as T from '@type'
import * as TABLE from '@modules/database/_tables'
import * as TV from '@testValue'
import * as U from '@util'

export class TestDB {
  // AREA1: Module Area
  private static directoryDBService: TABLE.DirectoryDBService = TABLE.DirectoryDBServiceTest.directoryDBService
  private static fileDBService: TABLE.FileDBService = TABLE.FileDBServiceTest.fileDBService

  // AREA2: Static Variable Area
  private static db: mysql.Pool = null // GKDTestBase 에서 생성해서 넘겨준다

  private static chatRoomRouters: {[userOId: string]: {[targetUserOId: string]: string}} = {}
  private static chatRooms: {[chatRoomOId: string]: T.ChatRoomType} = {}
  private static directories: {[dirOId: string]: T.DirectoryType} = {}
  private static files: {[fileOId: string]: T.FileType} = {}
  private static rootDir: T.DirectoryType = {
    dirName: 'WILL_BE_INIT_IN_CREATE',
    dirOId: null,
    fileOIdsArr: [],
    parentDirOId: null,
    subDirOIdsArr: []
  }
  private static usersCommon: {[userAuth: number]: T.UserType[]} = {}

  // AREA3: Constant Variable Area

  constructor() {}

  // AREA4: Method Area

  public async cleanUpDB() {
    if (TestDB.db === null) return

    try {
      await this._deleteDBs()
      await this._checkRemainDB()

      console.log('DB 가 리셋되었습니다.')
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      TestDB.db = null
      // ::
    }
  }
  public async initTestDB(db: mysql.Pool) {
    try {
      if (TestDB.db !== null) return
      console.log(`DB 가 초기화 되고 있습니다...`)
      TestDB.db = db

      /**
       * 1. 테스트용 기본 유저(로컬) 생성
       * 2. 테스트용 기본 디렉토리 생성
       * 3. 테스트용 기본 파일 생성
       */
      await this._createUsersCommon()
      await this._createDirectories()
      await this._createFiles()
      await this._createChatRooms()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  public getChatRoomOId(userOId: string, targetUserOId: string) {
    if (!TestDB.chatRoomRouters[userOId]) return {chatRoomOId: null}

    return {chatRoomOId: TestDB.chatRoomRouters[userOId][targetUserOId]}
  }
  public getDirectory(dirOId: string) {
    return {directory: TestDB.directories[dirOId]}
  }
  public getFile(fileOId: string) {
    return {file: TestDB.files[fileOId]}
  }
  public getJwtPayload(userAuth: number, userIdx: number = 0) {
    const {signUpType, userId, userOId, userName} = this.getUserCommon(userAuth, userIdx).user
    const jwtPayload: T.JwtPayloadType = {
      userOId,
      userName,
      signUpType,
      userId
    }
    return {jwtPayload}
  }
  public getUserCommon(userAuth: number, userIdx: number = 0) {
    if (userAuth !== AUTH_USER || userIdx === 0) {
      return {user: TestDB.usersCommon[userAuth][0]}
    } // ::
    else {
      return {user: TestDB.usersCommon[userAuth][userIdx]}
    }
  }
  public getRootDir() {
    return {directory: TestDB.rootDir}
  }

  public async resetBaseDB(resetFlag: number) {
    /**
     * 테스트용 데이터를 원래대로 돌려놓는다
     *
     * 1. 유저 롤백
     * 2. 디렉토리 롤백
     * 3. 파일 롤백
     * 4. 채팅방 + 라우터 롤백
     */
    const connection = await TestDB.db.getConnection()

    const {RESET_FLAG_USER, RESET_FLAG_DIR, RESET_FLAG_FILE, RESET_FLAG_CHAT_ROOM} = TV

    const {chatRoomOId_root_0, chatRoomOId_root_1, chatRoomOId_0_1, chatRoomOId_0_banned} = TV
    const {
      chatRoomInfo_root_0,
      chatRoomInfo_root_1,
      chatRoomInfo_0_1,
      chatRoomInfo_0_banned,
      chatRoomInfo_0_root,
      chatRoomInfo_1_root,
      chatRoomInfo_1_0,
      chatRoomInfo_banned_0
    } = TV
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {dirInfo_root, dirInfo_0, dirInfo_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    const {fileInfo_root, fileInfo_0, fileInfo_1} = TV
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {userInfo_root, userInfo_user_0, userInfo_user_1, userInfo_banned} = TV

    try {
      const isUser = resetFlag & RESET_FLAG_USER
      const isDir = resetFlag & RESET_FLAG_DIR
      const isFile = resetFlag & RESET_FLAG_FILE
      const isChatRoom = resetFlag & RESET_FLAG_CHAT_ROOM

      /**
       * 1. 유저 롤백
       *   - 수정됬을수도 있는 DB 의 내용을 저장된 내용으로 돌려놓는다.
       */
      if (isUser) {
        const queryUserAdmin = `UPDATE users SET picture = ?, signUpType = ?, userId = ?, userName = ?, userAuth = ?, userMail = ? WHERE userOId = ?`

        const paramUserAdmin = [
          userInfo_root.picture,
          userInfo_root.signUpType,
          userInfo_root.userId,
          userInfo_root.userName,
          AUTH_ADMIN,
          userInfo_root.userMail,
          userOId_root
        ]
        const paramUserUser_0 = [
          userInfo_user_0.picture,
          userInfo_user_0.signUpType,
          userInfo_user_0.userId,
          userInfo_user_0.userName,
          AUTH_USER,
          userInfo_user_0.userMail,
          userOId_user_0
        ]
        const paramUserUser_1 = [
          userInfo_user_1.picture,
          userInfo_user_1.signUpType,
          userInfo_user_1.userId,
          userInfo_user_1.userName,
          AUTH_USER,
          userInfo_user_1.userMail,
          userOId_user_1
        ]
        const paramUserBanned = [
          userInfo_banned.picture,
          userInfo_banned.signUpType,
          userInfo_banned.userId,
          userInfo_banned.userName,
          AUTH_GUEST,
          userInfo_banned.userMail,
          userOId_banned
        ]
        await connection.execute(queryUserAdmin, paramUserAdmin)
        await connection.execute(queryUserAdmin, paramUserUser_0)
        await connection.execute(queryUserAdmin, paramUserUser_1)
        await connection.execute(queryUserAdmin, paramUserBanned)
      }

      /**
       * 2. 디렉토리 롤백
       */
      if (isDir) {
        const queryDir = `UPDATE directories SET dirName = ?, parentDirOId = ?, dirIdx = ?, fileArrLen = ?, subDirArrLen = ? WHERE dirOId = ?`

        const paramDirRoot = [
          dirInfo_root.dirName,
          dirInfo_root.parentDirOId,
          dirInfo_root.dirIdx,
          dirInfo_root.fileArrLen,
          dirInfo_root.subDirArrLen,
          dirOId_root
        ]
        const paramDir_0 = [
          dirInfo_0.dirName, // ::
          dirInfo_0.parentDirOId,
          dirInfo_0.dirIdx,
          dirInfo_0.fileArrLen,
          dirInfo_0.subDirArrLen,
          dirOId_0
        ]
        const paramDir_1 = [
          dirInfo_1.dirName, // ::
          dirInfo_1.parentDirOId,
          dirInfo_1.dirIdx,
          dirInfo_1.fileArrLen,
          dirInfo_1.subDirArrLen,
          dirOId_1
        ]

        await connection.execute(queryDir, paramDirRoot)
        await connection.execute(queryDir, paramDir_0)
        await connection.execute(queryDir, paramDir_1)
      }

      /**
       * 3. 파일 롤백
       */
      if (isFile) {
        const queryFile = `UPDATE files SET content = ?, dirOId = ?, fileIdx = ?, fileName = ?, fileStatus = ?, userName = ?, userOId = ? WHERE fileOId = ?`

        const paramFileRoot = [
          fileInfo_root.content,
          dirOId_root,
          fileInfo_root.fileIdx,
          fileInfo_root.fileName,
          fileInfo_root.fileStatus,
          fileInfo_root.userName,
          userOId_root,
          fileOId_root
        ]
        const paramFile_0 = [
          fileInfo_0.content,
          dirOId_0,
          fileInfo_0.fileIdx,
          fileInfo_0.fileName,
          fileInfo_0.fileStatus,
          fileInfo_0.userName,
          userOId_root,
          fileOId_0
        ]
        const paramFile_1 = [
          fileInfo_1.content,
          dirOId_1,
          fileInfo_1.fileIdx,
          fileInfo_1.fileName,
          fileInfo_1.fileStatus,
          fileInfo_1.userName,
          userOId_root,
          fileOId_1
        ]

        await connection.execute(queryFile, paramFileRoot)
        await connection.execute(queryFile, paramFile_0)
        await connection.execute(queryFile, paramFile_1)
      }

      /**
       * 4-1. 채팅방 롤백
       */
      if (isChatRoom) {
        const queryChatRoom = `UPDATE chatRooms SET lastChatDate = ?, numChat = ? WHERE chatRoomOId = ?`

        const paramChatRoom_root_0 = [chatRoomInfo_root_0.lastChatDate, chatRoomInfo_root_0.numChat, chatRoomOId_root_0]
        const paramChatRoom_root_1 = [chatRoomInfo_root_1.lastChatDate, chatRoomInfo_root_1.numChat, chatRoomOId_root_1]
        const paramChatRoom_0_1 = [chatRoomInfo_0_1.lastChatDate, chatRoomInfo_0_1.numChat, chatRoomOId_0_1]
        const paramChatRoom_0_banned = [chatRoomInfo_0_banned.lastChatDate, chatRoomInfo_0_banned.numChat, chatRoomOId_0_banned]

        await connection.execute(queryChatRoom, paramChatRoom_root_0)
        await connection.execute(queryChatRoom, paramChatRoom_root_1)
        await connection.execute(queryChatRoom, paramChatRoom_0_1)
        await connection.execute(queryChatRoom, paramChatRoom_0_banned)

        /**
         * 4-2. 채팅방 라우터 롤백
         */
        const queryChatRoomRouter = `UPDATE chatRoomRouters SET roomStatus = ?, unreadMessageCount = ? WHERE userOId = ? AND targetUserOId = ?`

        const paramChatRoomRouter_root_0 = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_root_0.unreadMessageCount, userOId_root, userOId_user_0]
        const paramChatRoomRouter_root_1 = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_root_1.unreadMessageCount, userOId_root, userOId_user_1]
        const paramChatRoomRouter_0_1 = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_0_1.unreadMessageCount, userOId_user_0, userOId_user_1]
        const paramChatRoomRouter_0_banned = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_0_banned.unreadMessageCount, userOId_user_0, userOId_banned]
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_root_0)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_root_1)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_0_1)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_0_banned)

        const paramChatRoomRouter_0_root = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_0_root.unreadMessageCount, userOId_user_0, userOId_root]
        const paramChatRoomRouter_1_root = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_1_root.unreadMessageCount, userOId_user_1, userOId_root]
        const paramChatRoomRouter_1_0 = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_1_0.unreadMessageCount, userOId_user_1, userOId_user_0]
        const paramChatRoomRouter_banned_0 = [CHAT_ROOM_STATUS_ACTIVE, chatRoomInfo_banned_0.unreadMessageCount, userOId_banned, userOId_user_0]
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_0_root)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_1_root)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_1_0)
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter_banned_0)
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  // AREA5: Create, Delete Function Area

  /**
   * 디렉토리를 만든다.
   *   - DB 의 생성용 함수를 쓴다.
   */
  public async createDirectoryFull(parentDirOId: string, dirName: string) {
    try {
      const dto: DTO.CreateDirDTO = {parentDirOId, dirName}
      const {directory} = await TestDB.directoryDBService.createDir('TestDB', dto)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  /**
   * 디렉토리를 만든다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async createDirectoryLight(parentDirOId: string, dirName: string) {
    const connection = await TestDB.db.getConnection()
    let dirOId = U.generateObjectId()

    try {
      while (true) {
        const query = `SELECT dirName FROM directories WHERE dirOId = ?`
        const [result] = await connection.execute(query, [dirOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        dirOId = U.generateObjectId()
      }

      let dirIdx = 0

      const query = `INSERT INTO directories (dirOId, dirName, dirIdx, parentDirOId) VALUES (?, ?, ?, ?)`

      const param = [dirOId, dirName, dirIdx, parentDirOId]
      await connection.execute(query, param)

      const directory: T.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  /**
   * 파일을 만든다.
   *   - DB 의 생성용 함수를 쓴다.
   */
  public async createFileFull(dirOId: string, fileName: string) {
    try {
      const {userOId, userName} = this.getUserCommon(AUTH_ADMIN).user
      const dto: DTO.CreateFileDTO = {dirOId, fileName, userName, userOId}
      const {file} = await TestDB.fileDBService.createFile('TestDB', dto)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  /**
   * 파일을 만든다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async createFileLight(dirOId: string, fileName: string) {
    const connection = await TestDB.db.getConnection()
    let fileOId = U.generateObjectId()
    const {userOId, userName} = this.getUserCommon(AUTH_ADMIN).user

    try {
      while (true) {
        const query = `SELECT fileName FROM files WHERE fileOId = ?`
        const [result] = await connection.execute(query, [fileOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        fileOId = U.generateObjectId()
      }

      let fileIdx = 0

      const query = `INSERT INTO files (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      const param = [fileOId, '', dirOId, fileIdx, fileName, FILE_NORMAL, userName, userOId]
      await connection.execute(query, param)

      const file: T.FileType = {
        fileOId,
        dirOId,
        fileName,
        fileStatus: FILE_NORMAL,
        userName,
        userOId,
        content: '',
        createdAt: new Date(),
        fileIdx,
        updatedAt: new Date()
      }
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  /**
   * 디렉토리를 삭제한다.
   *   - DB 의 삭제용 함수를 쓴다.
   */
  public async deleteDirectoryFull(dirOId: string) {
    try {
      await TestDB.directoryDBService.deleteDir('TestDB', dirOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  /**
   * 디렉토리를 삭제한다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async deleteDirectoryLight(dirOId: string) {
    const connection = await TestDB.db.getConnection()
    try {
      const queryDelete = `DELETE FROM directories WHERE dirOId = ?`
      const paramDelete = [dirOId]
      await connection.execute(queryDelete, paramDelete)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  /**
   * 자식 디렉토리들을 삭제한다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async deleteDirectoryLightSons(parentDirOId: string) {
    const connection = await TestDB.db.getConnection()
    try {
      const queryDelete = `DELETE FROM directories WHERE parentDirOId = ?`
      const paramDelete = [parentDirOId]
      await connection.execute(queryDelete, paramDelete)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  /**
   * 파일을 삭제한다.
   *   - DB 의 삭제용 함수를 쓴다.
   */
  public async deleteFileFull(fileOId: string) {
    try {
      await TestDB.fileDBService.deleteFile('TestDB', fileOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  /**
   * 파일을 삭제한다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async deleteFileLight(fileOId: string) {
    const connection = await TestDB.db.getConnection()
    try {
      const queryDelete = `DELETE FROM files WHERE fileOId = ?`
      const paramDelete = [fileOId]
      await connection.execute(queryDelete, paramDelete)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  /**
   * 자식 파일들을 삭제한다.
   *   - 쿼리를 직접 쓴다.
   *   - 부모 폴더를 건드리거나 하진 않는다.
   */
  public async deleteFileLightSons(parentDirOId: string) {
    const connection = await TestDB.db.getConnection()
    try {
      const queryDelete = `DELETE FROM files WHERE dirOId = ?`
      const paramDelete = [parentDirOId]
      await connection.execute(queryDelete, paramDelete)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  // AREA6: Private Function area

  private async _createUsersCommon() {
    const connection = await TestDB.db.getConnection()
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {userInfo_root, userInfo_user_0, userInfo_user_1, userInfo_banned} = TV

    try {
      const query = `INSERT INTO users (userOId, hashedPassword, picture, signUpType, userId, userMail, userName, userAuth, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const createdAt = new Date()
      const updatedAt = createdAt

      const paramBanned = [
        userOId_banned,
        bcrypt.hashSync(userInfo_banned.password, gkdSaltOrRounds),
        userInfo_banned.picture,
        userInfo_banned.signUpType,
        userInfo_banned.userId,
        userInfo_banned.userMail,
        userInfo_banned.userName,
        AUTH_GUEST,
        createdAt,
        updatedAt
      ]
      const paramUser_0 = [
        userOId_user_0,
        bcrypt.hashSync(userInfo_user_0.password, gkdSaltOrRounds),
        userInfo_user_0.picture,
        userInfo_user_0.signUpType,
        userInfo_user_0.userId,
        userInfo_user_0.userMail,
        userInfo_user_0.userName,
        AUTH_USER,
        createdAt,
        updatedAt
      ]
      const paramUser_1 = [
        userOId_user_1,
        bcrypt.hashSync(userInfo_user_1.password, gkdSaltOrRounds),
        userInfo_user_1.picture,
        userInfo_user_1.signUpType,
        userInfo_user_1.userId,
        userInfo_user_1.userMail,
        userInfo_user_1.userName,
        AUTH_USER,
        createdAt,
        updatedAt
      ]
      const paramRoot = [
        userOId_root,
        bcrypt.hashSync(userInfo_root.password, gkdSaltOrRounds),
        userInfo_root.picture,
        userInfo_root.signUpType,
        userInfo_root.userId,
        userInfo_root.userMail,
        userInfo_root.userName,
        AUTH_ADMIN,
        createdAt,
        updatedAt
      ]
      await connection.execute(query, paramBanned)
      await connection.execute(query, paramUser_0)
      await connection.execute(query, paramUser_1)
      await connection.execute(query, paramRoot)

      TestDB.usersCommon[AUTH_GUEST] = [
        {
          userOId: userOId_banned,
          userId: userInfo_banned.userId,
          userMail: userInfo_banned.userMail,
          userName: userInfo_banned.userName,
          picture: userInfo_banned.picture,
          userAuth: AUTH_GUEST,
          createdAt,
          updatedAt
        }
      ]
      TestDB.usersCommon[AUTH_USER] = [
        {
          userOId: userOId_user_0,
          userId: userInfo_user_0.userId,
          userMail: userInfo_user_0.userMail,
          userName: userInfo_user_0.userName,
          picture: userInfo_user_0.picture,
          userAuth: AUTH_USER,
          createdAt,
          updatedAt
        },
        {
          userOId: userOId_user_1,
          userId: userInfo_user_1.userId,
          userMail: userInfo_user_1.userMail,
          userName: userInfo_user_1.userName,
          picture: userInfo_user_1.picture,
          userAuth: AUTH_USER,
          createdAt,
          updatedAt
        }
      ]
      TestDB.usersCommon[AUTH_ADMIN] = [
        {
          userOId: userOId_root,
          userId: userInfo_root.userId,
          userMail: userInfo_root.userMail,
          userName: userInfo_root.userName,
          picture: userInfo_root.picture,
          userAuth: AUTH_ADMIN,
          createdAt,
          updatedAt
        }
      ]
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  private async _createDirectories() {
    /**
     * 1. DB 에 테스트용 디렉토리 생성
     *   - 루트 디렉토리
     *     - 디렉토리 인덱스: 0
     *     - 디렉토리 인덱스: 1
     * 2. 루트 디렉토리 설정
     * 3. 디렉토리 객체 설정
     */
    const connection = await TestDB.db.getConnection()
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {dirInfo_root, dirInfo_0, dirInfo_1} = TV
    try {
      /**
       * 1. DB 에 테스트용 디렉토리 생성
       *   - 루트 디렉토리
       *     - 디렉토리 인덱스: 0
       *     - 디렉토리 인덱스: 1
       */
      const query = `INSERT INTO directories (dirOId, dirIdx, dirName, parentDirOId, fileArrLen, subDirArrLen) VALUES (?, ?, ?, ?, ?, ?)`

      const paramRoot = [
        dirOId_root,
        dirInfo_root.dirIdx,
        dirInfo_root.dirName,
        dirInfo_root.parentDirOId,
        dirInfo_root.fileArrLen,
        dirInfo_root.subDirArrLen
      ]
      const paramDir_0 = [dirOId_0, dirInfo_0.dirIdx, dirInfo_0.dirName, dirInfo_0.parentDirOId, dirInfo_0.fileArrLen, dirInfo_0.subDirArrLen]
      const paramDir_1 = [dirOId_1, dirInfo_1.dirIdx, dirInfo_1.dirName, dirInfo_1.parentDirOId, dirInfo_1.fileArrLen, dirInfo_1.subDirArrLen]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 2. 루트 디렉토리 설정
      TestDB.rootDir = {
        dirName: dirInfo_root.dirName,
        dirOId: dirOId_root,
        fileOIdsArr: [],
        parentDirOId: null,
        subDirOIdsArr: [dirOId_0, dirOId_1]
      }

      // 3. 디렉토리 객체 설정
      TestDB.directories[dirOId_root] = TestDB.rootDir
      TestDB.directories[dirOId_0] = {
        dirName: dirInfo_0.dirName,
        dirOId: dirOId_0,
        fileOIdsArr: [],
        parentDirOId: dirOId_root,
        subDirOIdsArr: []
      }
      TestDB.directories[dirOId_1] = {
        dirName: dirInfo_1.dirName,
        dirOId: dirOId_1,
        fileOIdsArr: [],
        parentDirOId: dirOId_root,
        subDirOIdsArr: []
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  private async _createFiles() {
    /**
     * 1. 루트 폴더에 테스트용 파일 1개 생성
     * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
     * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
     * 4. 파일 객체 설정
     * 5. 디렉토리 객체 설정
     */
    const connection = await TestDB.db.getConnection()
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    const {fileInfo_root, fileInfo_0, fileInfo_1} = TV
    try {
      /**
       * 1. 루트 폴더에 테스트용 파일 1개 생성
       * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
       * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
       */
      const query = `INSERT INTO files (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const {userName, userOId} = this.getUserCommon(AUTH_ADMIN).user

      const createdAt = new Date()

      const paramRoot = [
        fileOId_root,
        fileInfo_root.content,
        dirOId_root,
        fileInfo_root.fileIdx,
        fileInfo_root.fileName,
        fileInfo_root.fileStatus,
        userName,
        userOId,
        createdAt
      ]
      const paramDir_0 = [
        fileOId_0,
        fileInfo_0.content,
        dirOId_0,
        fileInfo_0.fileIdx,
        fileInfo_0.fileName,
        fileInfo_0.fileStatus,
        userName,
        userOId,
        createdAt
      ]
      const paramDir_1 = [
        fileOId_1,
        fileInfo_1.content,
        dirOId_1,
        fileInfo_1.fileIdx,
        fileInfo_1.fileName,
        fileInfo_1.fileStatus,
        userName,
        userOId,
        createdAt
      ]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 4. 파일 객체 설정
      TestDB.files[fileOId_root] = {
        content: fileInfo_root.content,
        dirOId: dirOId_root,
        fileIdx: 0,
        fileOId: fileOId_root,
        fileStatus: 0,
        fileName: fileInfo_root.fileName,
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_0] = {
        content: fileInfo_0.content,
        dirOId: dirOId_0,
        fileIdx: 0,
        fileOId: fileOId_0,
        fileStatus: 0,
        fileName: fileInfo_0.fileName,
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_1] = {
        content: fileInfo_1.content,
        dirOId: dirOId_1,
        fileIdx: 0,
        fileOId: fileOId_1,
        fileStatus: 0,
        fileName: fileInfo_1.fileName,
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }

      /**
       * 5. 디렉토리 객체 설정
       */
      TestDB.directories[dirOId_root].fileOIdsArr.push(fileOId_root)
      TestDB.directories[dirOId_0].fileOIdsArr.push(fileOId_0)
      TestDB.directories[dirOId_1].fileOIdsArr.push(fileOId_1)

      // ::
    } catch (errObj) {
      // ::
      console.log(`[DB 생성 오류]: 파일 생성`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  private async _createChatRooms() {
    const connection = await TestDB.db.getConnection()

    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {
      chatRoomOId_root_0,
      chatRoomOId_root_1,
      chatRoomOId_0_1,
      chatRoomOId_0_banned,
      chatRoomOId_0_root,
      chatRoomOId_1_root,
      chatRoomOId_1_0,
      chatRoomOId_banned_0
    } = TV
    const {
      chatRoomInfo_root_0,
      chatRoomInfo_root_1,
      chatRoomInfo_0_1,
      chatRoomInfo_0_banned,
      chatRoomInfo_0_root,
      chatRoomInfo_1_root,
      chatRoomInfo_1_0,
      chatRoomInfo_banned_0
    } = TV

    const nowDate = chatRoomInfo_root_0.lastChatDate

    /**
     * 채팅방은 4개가 존재한다.
     *   1. 루트 - 0번째 유저
     *   2. 루트 - 1번째 유저
     *   3. 0번째 유저 - 1번째 유저
     *   4. 0번째 유저 - 밴 유저
     */
    try {
      // 1. chatRoom 을 만든다.
      const queryRoom_Root_0 = `INSERT INTO chatRooms (chatRoomOId, lastChatDate) VALUES (?, ?)`
      const paramsRoom_Root_0 = [chatRoomOId_root_0, nowDate]
      await connection.execute(queryRoom_Root_0, paramsRoom_Root_0)

      const queryRoom_Root_1 = `INSERT INTO chatRooms (chatRoomOId, lastChatDate) VALUES (?, ?)`
      const paramsRoom_Root_1 = [chatRoomOId_root_1, nowDate]
      await connection.execute(queryRoom_Root_1, paramsRoom_Root_1)

      const queryRoom_0_1 = `INSERT INTO chatRooms (chatRoomOId, lastChatDate) VALUES (?, ?)`
      const paramsRoom_0_1 = [chatRoomOId_0_1, nowDate]
      await connection.execute(queryRoom_0_1, paramsRoom_0_1)

      const queryRoom_0_Banned = `INSERT INTO chatRooms (chatRoomOId, lastChatDate) VALUES (?, ?)`
      const paramsRoom_0_Banned = [chatRoomOId_0_banned, nowDate]
      await connection.execute(queryRoom_0_Banned, paramsRoom_0_Banned)

      // 2. chatRoomRouter 을 만든다.
      const queryRouter_Root_0 = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_Root_0 = [chatRoomOId_root_0, userOId_root, userOId_user_0, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_Root_0, paramsRouter_Root_0)

      const queryRouter_Root_1 = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_Root_1 = [chatRoomOId_root_1, userOId_root, userOId_user_1, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_Root_1, paramsRouter_Root_1)

      const queryRouter_0_1 = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_0_1 = [chatRoomOId_0_1, userOId_user_0, userOId_user_1, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_0_1, paramsRouter_0_1)

      const queryRouter_0_Banned = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_0_Banned = [chatRoomOId_0_banned, userOId_user_0, userOId_banned, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_0_Banned, paramsRouter_0_Banned)

      const queryRouter_0_Root = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_0_Root = [chatRoomOId_0_root, userOId_user_0, userOId_root, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_0_Root, paramsRouter_0_Root)

      const queryRouter_1_Root = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_1_Root = [chatRoomOId_1_root, userOId_user_1, userOId_root, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_1_Root, paramsRouter_1_Root)

      const queryRouter_1_0 = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_1_0 = [chatRoomOId_1_0, userOId_user_1, userOId_user_0, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_1_0, paramsRouter_1_0)

      const queryRouter_Banned_0 = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsRouter_Banned_0 = [chatRoomOId_banned_0, userOId_banned, userOId_user_0, CHAT_ROOM_STATUS_ACTIVE]
      await connection.execute(queryRouter_Banned_0, paramsRouter_Banned_0)

      // 3. static router 초기값을 설정한다.
      TestDB.chatRoomRouters[userOId_root] = {}
      TestDB.chatRoomRouters[userOId_user_0] = {}
      TestDB.chatRoomRouters[userOId_user_1] = {}
      TestDB.chatRoomRouters[userOId_banned] = {}

      // 4. static router 값을 넣는다.
      TestDB.chatRoomRouters[userOId_root][userOId_user_0] = chatRoomOId_root_0
      TestDB.chatRoomRouters[userOId_root][userOId_user_1] = chatRoomOId_root_1
      TestDB.chatRoomRouters[userOId_user_0][userOId_user_1] = chatRoomOId_0_1
      TestDB.chatRoomRouters[userOId_user_0][userOId_banned] = chatRoomOId_0_banned

      TestDB.chatRoomRouters[userOId_user_0][userOId_root] = chatRoomOId_0_root
      TestDB.chatRoomRouters[userOId_user_1][userOId_root] = chatRoomOId_1_root
      TestDB.chatRoomRouters[userOId_user_1][userOId_user_0] = chatRoomOId_1_0
      TestDB.chatRoomRouters[userOId_banned][userOId_user_0] = chatRoomOId_banned_0

      // 5. static room 값을 넣는다.
      TestDB.chatRooms[chatRoomOId_root_0] = chatRoomInfo_root_0
      TestDB.chatRooms[chatRoomOId_root_1] = chatRoomInfo_root_1
      TestDB.chatRooms[chatRoomOId_0_1] = chatRoomInfo_0_1
      TestDB.chatRooms[chatRoomOId_0_banned] = chatRoomInfo_0_banned
      TestDB.chatRooms[chatRoomOId_0_root] = chatRoomInfo_0_root
      TestDB.chatRooms[chatRoomOId_1_root] = chatRoomInfo_1_root
      TestDB.chatRooms[chatRoomOId_1_0] = chatRoomInfo_1_0
      TestDB.chatRooms[chatRoomOId_banned_0] = chatRoomInfo_banned_0

      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  private async _deleteDBs() {
    /**
     * 1. 테스트용 채팅방 + 라우터 삭제
     * 2. 테스트용 파일 삭제
     * 3. 테스트용 디렉토리 삭제
     * 4. 테스트용 유저 삭제
     */
    const connection = await TestDB.db.getConnection()
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    const {chatRoomOId_root_0, chatRoomOId_root_1, chatRoomOId_0_1, chatRoomOId_0_banned} = TV
    try {
      // 1. 테스트용 채팅방 + 라우터 삭제
      const queryChatRoom = `DELETE FROM chatRooms WHERE chatRoomOId IN (?, ?, ?, ?)`
      const paramChatRoom = [chatRoomOId_root_0, chatRoomOId_root_1, chatRoomOId_0_1, chatRoomOId_0_banned]
      await connection.execute(queryChatRoom, paramChatRoom)

      const queryChatRoomRouter = `DELETE FROM chatRoomRouters WHERE chatRoomOId IN (?, ?, ?, ?)`
      const paramChatRoomRouter = [chatRoomOId_root_0, chatRoomOId_root_1, chatRoomOId_0_1, chatRoomOId_0_banned]
      await connection.execute(queryChatRoomRouter, paramChatRoomRouter)

      // 3. 테스트용 파일 삭제
      const queryFile = `DELETE FROM files WHERE fileOId IN (?, ?, ?)`
      const paramFile = [fileOId_root, fileOId_0, fileOId_1]
      await connection.execute(queryFile, paramFile)

      // 2. 테스트용 디렉토리 삭제
      const queryDir = `DELETE FROM directories WHERE dirOId IN (?, ?, ?)`
      const paramDir = [dirOId_root, dirOId_0, dirOId_1]
      await connection.execute(queryDir, paramDir)

      // 4. 테스트용 유저 삭제
      const query = `DELETE FROM users WHERE userOId IN (?, ?, ?, ?)`
      const param = [userOId_banned, userOId_user_0, userOId_user_1, userOId_root]
      await connection.execute(query, param)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  private async _checkRemainDB() {
    const connection = await TestDB.db.getConnection()
    try {
      const queryUser = `SELECT * FROM users`
      const queryDir = `SELECT * FROM directories`
      const queryFile = `SELECT * FROM files`
      const queryChatRoom = `SELECT * FROM chatRooms`
      const queryChatRoomRouter = `SELECT * FROM chatRoomRouters`

      const [userResult, dirResult, fileResult, chatRoomResult, chatRoomRouterResult] = await Promise.all([
        connection.execute(queryUser),
        connection.execute(queryDir),
        connection.execute(queryFile),
        connection.execute(queryChatRoom),
        connection.execute(queryChatRoomRouter)
      ])

      const userLen = (userResult[0] as any[]).length
      const dirLen = (dirResult[0] as any[]).length
      const fileLen = (fileResult[0] as any[]).length
      const chatRoomLen = (chatRoomResult[0] as any[]).length
      const chatRoomRouterLen = (chatRoomRouterResult[0] as any[]).length

      let errorMsg = ''

      if (userLen > 0) {
        errorMsg += `테스트용 유저가 남아있습니다. ${userLen}개\n`
      }
      if (dirLen > 0) {
        errorMsg += `테스트용 디렉토리가 남아있습니다. ${dirLen}개\n`
      }
      if (fileLen > 0) {
        errorMsg += `테스트용 파일이 남아있습니다. ${fileLen}개\n`
      }
      if (chatRoomLen > 0) {
        errorMsg += `테스트용 채팅방이 남아있습니다. ${chatRoomLen}개\n`
      }
      if (chatRoomRouterLen > 0) {
        errorMsg += `테스트용 채팅방 라우터가 남아있습니다. ${chatRoomRouterLen}개\n`
      }

      if (errorMsg.length > 0) {
        throw errorMsg
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
