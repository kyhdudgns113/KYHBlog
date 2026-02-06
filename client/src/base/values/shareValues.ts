import * as SC from '@secret'

export const BASE_URL = `${SC.serverUrl}`
export const CLIENT_URL = `${SC.clientIP}:${SC.clientPort}` // SEO 메타 태그용 클라이언트 URL

export const CHAT_MAX_LENGTH = 1000
export const COMMENT_MAX_LENGTH = 300
export const DIR_NAME_MAX_LENGTH = 20
export const FILE_NAME_MAX_LENGTH = 40

export const PASSWORD_LENGTH_MIN = 8
export const PASSWORD_LENGTH_MAX = 20

export const USER_NAME_LENGTH_MIN = 2
export const USER_NAME_LENGTH_MAX = 20

export const USER_ID_LENGTH_MIN = 6
export const USER_ID_LENGTH_MAX = 20

export const [ALARM_STATUS_NEW, ALARM_STATUS_OLD] = [0, 1]
export const [ALARM_TYPE_FILE_COMMENT, ALARM_TYPE_COMMENT_REPLY, ALARM_TYPE_TAG_REPLY, ALARM_TYPE_QNA_NEW, ALARM_TYPE_QNA_COMMENT] = [0, 1, 2, 3, 4]
export const [AUTH_ADMIN, AUTH_USER, AUTH_GUEST] = [100, 1, 0]

export const [CHAT_ROOM_STATUS_INACTIVE, CHAT_ROOM_STATUS_ACTIVE] = [0, 1]

export const [FILE_NORMAL, FILE_HIDDEN, FILE_NOTICE] = [0, 1, 2]

export const [QNA_TITLE_LENGTH_MAX, QNA_CONTENT_LENGTH_MAX] = [32, 1000]

export const DATE_DIFF_NEW_FILE = 1000 * 60 * 60 * 24 * 3 // 7일

export const REGIX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/
export const REGIX_USER_ID = /^[a-zA-Z0-9_.]+$/
export const REGIX_USER_MAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/
export const REGIX_USER_NAME = /^[가-힣a-zA-Z0-9_]+$/
