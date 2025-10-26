// AREA1: 베이스 타입
export type FileRowType = {
  /**
   * Lefter 같은곳에서 OId 랑 name 만 사용하기 위해 쓰는 타입
   */
  dirOId: string
  fileName: string
  fileOId: string
  fileStatus: number
}

// AREA2: 일반 타입
export type AlarmType = {
  /**
   * socketTypes 의 NewAlarmType 과 동일해야 한다.
   * 이거 바꾸면 그것도 바꿔준다.
   */
  alarmOId: string
  alarmStatus: number
  alarmType: number
  content: string
  createdAt: Date
  fileOId: string
  senderUserName: string
  senderUserOId: string
  userOId: string
}
export type ChatType = {
  /**
   * socketTypes 의 NewChatType 과 동일해야 한다.
   * 이거 바꾸면 그것도 바꿔준다.
   */
  chatIdx: number
  chatRoomOId: string
  content: string
  createdAt: Date
  userOId: string // 보낸 유저
  userName: string // 보낸 유저
}
export type ChatRoomType = {
  chatRoomOId: string
  chatRoomName: string // 보통은 targetUserName 이 들어간다.
  targetUserId: string
  targetUserMail: string
  targetUserName: string
  targetUserOId: string
  unreadMessageCount: number
  lastChatDate: Date
}
export type CommentType = {
  commentOId: string
  content: string // 댓글 내용
  createdAt: Date
  fileOId: string
  userOId: string
  userName: string
}
export type DirectoryType = {
  // dirIdx: number // 클라이언트는 정렬된것만 주고 받는다.
  dirName: string
  dirOId: string
  fileOIdsArr: string[]
  // isOpen?: boolean // 클라이언트에서 폴더 열렸는지 확인용 은 클라에서 따로 관리하자
  parentDirOId: string | null
  subDirOIdsArr: string[]
}
export type ExtraDirObjectType = {
  /**
   * 특정 디렉토리만 수정할때 쓰는 타입
   * - BFS 방식으로 저장한다.
   */
  dirOIdsArr: string[]
  directories: {[dirOId: string]: DirectoryType}
}
export type ExtraFileRowObjectType = {
  /**
   * 특정 FileRow만 수정할때 쓰는 타입
   * - BFS 방식으로 저장한다.
   */
  fileOIdsArr: string[]
  fileRows: {[fileOId: string]: FileRowType}
}
export type FileType = {
  content: string
  createdAt: Date
  dirOId: string
  fileIdx: number
  fileOId: string
  fileStatus: number
  fileName: string
  updatedAt: Date
  userName: string
  userOId: string
}
export type LogType = {
  date: Date
  errObj: any // 서버에서 throw 받은 에러 오브젝트
  gkd: any // 서버에 저장할 디테일한 에러 메시지
  gkdErrCode: string // 에러코드
  gkdErrMsg: string // 클라이언트에 띄울 에러메시지
  gkdLog: string // 로그 메시지
  gkdStatus: any // 로그가 발생했을때 저장된 상태
  logOId: string
  userId: string
  userName: string
  userOId: string
  where: string
}
export type ReplyType = {
  commentOId: string
  fileOId: string
  createdAt: Date
  content: string // 대댓글 내용
  replyOId: string
  targetUserOId: string
  targetUserName: string
  userOId: string
  userName: string
}
export type UserType = {
  createdAt: Date
  picture?: string
  signUpType?: 'common' | 'google'
  updatedAt: Date
  userAuth: number
  userId: string
  userMail: string
  userName: string
  userOId: string
}
