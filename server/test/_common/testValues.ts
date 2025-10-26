import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER} from '@secret'

// AREA1: Constant Variable Area

const nowDate = new Date()
export const [RESET_FLAG_USER, RESET_FLAG_DIR, RESET_FLAG_FILE, RESET_FLAG_CHAT_ROOM] = [1, 2, 4, 8]

// AREA2: User Area

export const userOId_root: string = '000000000000000000000001'
export const userOId_user_0: string = '000000000000000000000002'
export const userOId_user_1: string = '000000000000000000000003'
export const userOId_banned: string = '000000000000000000000004'

export const userInfo_root = {
  password: 'authRootPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonRoot',
  userOId: userOId_root,
  userMail: 'root@root.root',
  userName: 'commonRoot',
  userAuth: AUTH_ADMIN
}
export const userInfo_user_0 = {
  password: 'authUserPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonUser0',
  userOId: userOId_user_0,
  userMail: 'user0@user.user',
  userName: 'commonUser0',
  userAuth: AUTH_USER
}
export const userInfo_user_1 = {
  password: 'authUserPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonUser1',
  userOId: userOId_user_1,
  userMail: 'user1@user.user',
  userName: 'commonUser1',
  userAuth: AUTH_USER
}
export const userInfo_banned = {
  password: 'authBannedPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonBan',
  userOId: userOId_banned,
  userMail: 'ban@ban.ban',
  userName: 'commonBan',
  userAuth: AUTH_GUEST
}

// AREA3: Directory Area

export const dirOId_root: string = '000000000000000000010000'
export const dirOId_0: string = '000000000000000000010100'
export const dirOId_1: string = '000000000000000000010200'

export const dirInfo_root = {
  dirIdx: 0,
  dirName: 'root',
  dirOId: dirOId_root,
  fileArrLen: 1,
  subDirArrLen: 2,
  parentDirOId: null
}
export const dirInfo_0 = {
  dirIdx: 0,
  dirName: 'dir0',
  dirOId: dirOId_0,
  fileArrLen: 1,
  subDirArrLen: 0,
  parentDirOId: dirOId_root
}
export const dirInfo_1 = {
  dirIdx: 1,
  dirName: 'dir1',
  dirOId: dirOId_1,
  fileArrLen: 1,
  subDirArrLen: 0,
  parentDirOId: dirOId_root
}

// AREA4: File Area

export const fileOId_root: string = '000000000000000000010001'
export const fileOId_0: string = '000000000000000000010101'
export const fileOId_1: string = '000000000000000000010201'

export const fileInfo_root = {
  content: 'content0',
  dirOId: dirOId_root,
  fileIdx: 0,
  fileOId: fileOId_root,
  fileStatus: 0,
  fileName: 'file_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}
export const fileInfo_0 = {
  content: 'content1',
  dirOId: dirOId_0,
  fileIdx: 0,
  fileOId: fileOId_0,
  fileStatus: 0,
  fileName: 'file_0_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}
export const fileInfo_1 = {
  content: 'content2',
  dirOId: dirOId_1,
  fileIdx: 0,
  fileOId: fileOId_1,
  fileStatus: 0,
  fileName: 'file_1_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}

// AREA5: Chat Area

export const chatRoomOId_root_0: string = '000000000000000000000012'
export const chatRoomOId_root_1: string = '000000000000000000000013'
export const chatRoomOId_0_1: string = '000000000000000000000023'
export const chatRoomOId_0_banned: string = '000000000000000000000024'

export const chatRoomOId_0_root: string = chatRoomOId_root_0
export const chatRoomOId_1_root: string = chatRoomOId_root_1
export const chatRoomOId_1_0: string = chatRoomOId_0_1
export const chatRoomOId_banned_0: string = chatRoomOId_0_banned

export const chatRoomInfo_root_0 = {
  chatRoomOId: chatRoomOId_root_0,
  chatRoomName: userInfo_user_0.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_user_0.userId,
  targetUserMail: userInfo_user_0.userMail,
  targetUserName: userInfo_user_0.userName,
  targetUserOId: userOId_user_0,
  unreadMessageCount: 0,
  userOId: userOId_root
}
export const chatRoomInfo_root_1 = {
  chatRoomOId: chatRoomOId_root_1,
  chatRoomName: userInfo_user_1.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_user_1.userId,
  targetUserMail: userInfo_user_1.userMail,
  targetUserName: userInfo_user_1.userName,
  targetUserOId: userOId_user_1,
  unreadMessageCount: 0,
  userOId: userOId_root
}
export const chatRoomInfo_0_1 = {
  chatRoomOId: chatRoomOId_0_1,
  chatRoomName: userInfo_user_1.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_user_1.userId,
  targetUserMail: userInfo_user_1.userMail,
  targetUserName: userInfo_user_1.userName,
  targetUserOId: userOId_user_1,
  unreadMessageCount: 0,
  userOId: userOId_user_0
}
export const chatRoomInfo_0_banned = {
  chatRoomOId: chatRoomOId_0_banned,
  chatRoomName: userInfo_banned.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_banned.userId,
  targetUserMail: userInfo_banned.userMail,
  targetUserName: userInfo_banned.userName,
  targetUserOId: userOId_banned,
  unreadMessageCount: 0,
  userOId: userOId_user_0
}

export const chatRoomInfo_0_root = {
  chatRoomOId: chatRoomOId_0_root,
  chatRoomName: userInfo_root.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_root.userId,
  targetUserMail: userInfo_root.userMail,
  targetUserName: userInfo_root.userName,
  targetUserOId: userOId_root,
  unreadMessageCount: 0,
  userOId: userOId_user_0
}
export const chatRoomInfo_1_root = {
  chatRoomOId: chatRoomOId_1_root,
  chatRoomName: userInfo_root.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_root.userId,
  targetUserMail: userInfo_root.userMail,
  targetUserName: userInfo_root.userName,
  targetUserOId: userOId_root,
  unreadMessageCount: 0,
  userOId: userOId_user_1
}
export const chatRoomInfo_1_0 = {
  chatRoomOId: chatRoomOId_1_0,
  chatRoomName: userInfo_user_0.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_user_0.userId,
  targetUserMail: userInfo_user_0.userMail,
  targetUserName: userInfo_user_0.userName,
  targetUserOId: userOId_user_0,
  unreadMessageCount: 0,
  userOId: userOId_user_1
}
export const chatRoomInfo_banned_0 = {
  chatRoomOId: chatRoomOId_banned_0,
  chatRoomName: userInfo_user_0.userName,
  lastChatDate: nowDate,
  numChat: 0,
  targetUserId: userInfo_user_0.userId,
  targetUserMail: userInfo_user_0.userMail,
  targetUserName: userInfo_user_0.userName,
  targetUserOId: userOId_user_0,
  unreadMessageCount: 0,
  userOId: userOId_banned
}
