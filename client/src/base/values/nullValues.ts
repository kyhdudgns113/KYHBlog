import * as LT from '@localizeType'
import * as ST from '@shareType'
import * as T from '@type'

export const NULL_AUTH_BODY = (): T.AuthBodyType => ({
  jwtFromServer: '',
  picture: '',
  userAuth: 0,
  userId: '',
  userMail: '',
  userName: '',
  userOId: ''
})

export const NULL_CHAT_ROOM = (): LT.ChatRoomTypeLocal => ({
  chatRoomOId: '',
  targetUserId: '',
  targetUserMail: '',
  targetUserOId: '',
  targetUserName: '',
  lastChatDateValue: 0,
  chatRoomName: '',
  unreadMessageCount: 0
})

export const NULL_DIR = (): ST.DirectoryType => ({
  dirName: '',
  dirOId: '',
  fileOIdsArr: [],
  parentDirOId: '',
  subDirOIdsArr: []
})

export const NULL_FILE = (): LT.FileTypeLocal => ({
  content: '',
  createdAtValue: 0,
  dirOId: '',
  fileIdx: 0,
  fileOId: '',
  fileStatus: 0,
  fileName: '',
  updatedAtValue: 0,
  userName: '',
  userOId: ''
})

export const NULL_QNA = (): LT.QnATypeLocal => ({
  content: '',
  createdAtValue: 0,
  isPrivate: false,
  userName: '',
  userOId: '',
  qnAOId: '',
  title: '',
  updatedAtValue: 0,
  viewCount: 0
})

export const NULL_USER = (): LT.UserTypeLocal => ({
  createdAtValue: 0,
  updatedAtValue: 0,
  userAuth: 0,
  userId: '',
  userMail: '',
  userName: '',
  userOId: ''
})
