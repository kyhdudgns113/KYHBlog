export const CHAT_MAX_LENGTH = 1000
export const COMMENT_MAX_LENGTH = 300
export const FILE_NAME_MAX_LENGTH = 40

export const PASSWORD_LENGTH_MIN = 8
export const PASSWORD_LENGTH_MAX = 20

export const USER_NAME_LENGTH_MIN = 2
export const USER_NAME_LENGTH_MAX = 20

export const USER_ID_LENGTH_MIN = 6
export const USER_ID_LENGTH_MAX = 20

export const [ALARM_STATUS_NEW, ALARM_STATUS_OLD] = [0, 1]
export const [ALARM_TYPE_FILE_COMMENT, ALARM_TYPE_COMMENT_REPLY, ALARM_TYPE_TAG_REPLY] = [0, 1, 2]
export const [AUTH_ADMIN, AUTH_USER, AUTH_GUEST] = [100, 1, 0]

export const [CHAT_ROOM_STATUS_INACTIVE, CHAT_ROOM_STATUS_ACTIVE] = [0, 1]

export const REGIX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/
export const REGIX_USER_ID = /^[a-zA-Z0-9_.]+$/
export const REGIX_USER_MAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/
export const REGIX_USER_NAME = /^[가-힣a-zA-Z0-9_]+$/
