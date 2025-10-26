export type CreateAlarmDTO = {
  alarmType: number
  content: string
  createdAt: Date
  fileOId: string
  senderUserName: string
  senderUserOId: string
  userOId: string
}

export type CreateChatDTO = {
  chatIdx: number
  chatRoomOId: string
  content: string
  createdAt: Date
  userOId: string
  userName: string
}

export type CreateChatRoomDTO = {
  userOId: string
  targetUserOId: string
}

export type CreateCommentDTO = {
  content: string
  fileOId: string
  userName: string
  userOId: string
}

export type CreateDirDTO = {
  dirName: string
  parentDirOId: string
}

export type CreateFileDTO = {
  dirOId: string
  fileName: string
  userName: string
  userOId: string
}

export type CreateLogDTO = {
  errObj: any
  gkd: any
  gkdErrCode: string
  gkdErrMsg: any
  gkdStatus: any
  gkdLog: string
  userId: string
  userName: string
  userOId: string
  where: string
}

export type CreateReplyDTO = {
  commentOId: string
  content: string
  targetUserOId: string
  targetUserName: string
  userName: string
  userOId: string
}

export type SignUpDTO = {
  userId: string
  userMail: string
  userName: string
  password: string
  picture: string
  signUpType: 'common' | 'google'
}
