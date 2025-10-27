import type {ChatRoomType, DirectoryType, FileType, UserType} from '@shareType'
import type {AuthBodyType} from '@type'

export const NULL_AUTH_BODY = (): AuthBodyType => ({
  jwtFromServer: '',
  picture: '',
  userAuth: 0,
  userId: '',
  userMail: '',
  userName: '',
  userOId: ''
})

export const NULL_CHAT_ROOM = (): ChatRoomType => ({
  chatRoomOId: '',
  targetUserId: '',
  targetUserMail: '',
  targetUserOId: '',
  targetUserName: '',
  lastChatDate: new Date(),
  chatRoomName: '',
  unreadMessageCount: 0
})

export const NULL_DIR = (): DirectoryType => ({
  dirName: '',
  dirOId: '',
  fileOIdsArr: [],
  parentDirOId: '',
  subDirOIdsArr: []
})

export const NULL_FILE = (): FileType => ({
  content: '',
  createdAt: new Date(),
  dirOId: '',
  fileIdx: 0,
  fileOId: '',
  fileStatus: 0,
  fileName: '',
  updatedAt: new Date(),
  userName: '',
  userOId: ''
})

export const NULL_USER = (): UserType => ({
  createdAt: new Date(),
  updatedAt: new Date(),
  userAuth: 0,
  userId: '',
  userMail: '',
  userName: '',
  userOId: ''
})
