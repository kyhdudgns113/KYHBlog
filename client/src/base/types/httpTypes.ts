import * as ST from './shareTypes'

export type AddCommentType = {
  content: string
  fileOId: string
  userName: string
  userOId: string
}

export type AddDirectoryType = {
  dirName: string
  parentDirOId: string // 여기는 null 이면 안된다. 클라가 생성할 폴더의 부모는 지정해야 한다.
}

export type AddFileType = {
  dirOId: string
  fileName: string
}

export type AddReplyType = {
  commentOId: string
  content: string
  targetUserOId: string
  targetUserName: string
  userName: string
  userOId: string
}

export type ChangeDirNameType = {
  dirName: string
  dirOId: string
}

export type ChangeFileNameType = {
  fileName: string
  fileOId: string
}

export type CheckNewAlarmType = {
  checkedAlarmArr: ST.AlarmType[]
}

export type EditCommentType = {
  commentOId: string
  newContent: string
}

export type EditFileType = {
  content: string
  fileName: string
  fileOId: string
}

export type EditFileStatusType = {
  fileOId: string
  newFileStatus: number
}

export type EditReplyType = {
  replyOId: string
  newContent: string
}

export type LogInDataType = {
  /**
   * 로컬 방식 로그인 타입
   */
  password: string
  userId: string
}

export type MoveDirectoryType = {
  moveDirOId: string
  oldParentDirOId: string // 기존 부모 폴더의 OId
  oldParentChildArr: string[] // 기존 부모 폴더의 자식 디렉토리 OId 배열
  newParentDirOId: string // 새로운 부모 폴더의 OId
  newParentChildArr: string[] // 새로운 부모 폴더의 자식 디렉토리 OId 배열
}

export type MoveFileType = {
  moveFileOId: string
  oldParentDirOId: string // 기존 부모 폴더의 OId
  oldParentChildArr: string[] // 기존 부모 폴더의 자식 파일 OId 배열
  newParentDirOId: string // 새로운 부모 폴더의 OId
  newParentChildArr: string[] // 새로운 부모 폴더의 자식 파일 OId 배열
}

export type SignUpDataType = {
  password: string
  userMail: string
  userId: string
  userName: string
}
