export type AlarmTypeLocal = {
  alarmOId: string
  alarmStatus: number
  alarmType: number
  content: string
  createdAtValue: number
  fileOId: string
  senderUserName: string
  senderUserOId: string
  userOId: string
}

export type ChatTypeLocal = {
  chatIdx: number
  chatRoomOId: string
  content: string
  createdAtValue: number
  userOId: string // 보낸 유저
  userName: string // 보낸 유저
}
export type ChatRoomTypeLocal = {
  chatRoomOId: string
  chatRoomName: string // 보통은 targetUserName 이 들어간다.
  targetUserId: string
  targetUserMail: string
  targetUserName: string
  targetUserOId: string
  unreadMessageCount: number
  lastChatDateValue: number
}
export type CommentTypeLocal = {
  commentOId: string
  content: string // 댓글 내용
  createdAtValue: number
  fileOId: string
  userOId: string
  userName: string
}
export type FileTypeLocal = {
  content: string
  createdAtValue: number
  dirOId: string
  fileIdx: number
  fileOId: string
  fileStatus: number
  fileName: string
  updatedAtValue: number
  userName: string
  userOId: string
}
export type LogTypeLocal = {
  dateValue: number
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
export type QnATypeLocal = {
  content: string
  createdAtValue: number
  isPrivate: boolean
  userName: string
  userOId: string
  qnAOId: string // Primary Key
  title: string
  updatedAtValue: number
  viewCount: number
}
export type ReplyTypeLocal = {
  commentOId: string
  fileOId: string
  createdAtValue: number
  content: string // 대댓글 내용
  replyOId: string
  targetUserOId: string
  targetUserName: string
  userOId: string
  userName: string
}
export type UserTypeLocal = {
  createdAtValue: number
  picture?: string
  signUpType?: 'common' | 'google'
  updatedAtValue: number
  userAuth: number
  userId: string
  userMail: string
  userName: string
  userOId: string
}
