CREATE TABLE `chatRooms` (
  chatRoomOId CHAR(24) PRIMARY KEY,

  lastChatDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  numChat INT DEFAULT 0
)   CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `chatRoomRouters` (
  chatRoomOId CHAR(24) NOT NULL,

  roomStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,
  targetUserOId CHAR(24) NOT NULL,
  unreadMessageCount INT DEFAULT 0,
  userOId CHAR(24) NOT NULL,

  -- 유저의 대상 유저와의 채팅방은 하나여야 한다.
  CONSTRAINT chatRoomRouter_pk PRIMARY KEY (userOId, targetUserOId),

  -- 유저의 채팅방과 연결된 대상유저는 하나여야 한다.
  CONSTRAINT unique_user_room UNIQUE (userOId, chatRoomOId),

  -- 대상 유저의 채팅방과 연결된 유저는 하나여야 한다.
  CONSTRAINT unique_target_room UNIQUE (targetUserOId, chatRoomOId),

  CONSTRAINT fk_chatRoomRouter_chatRoomOId 
    FOREIGN KEY (chatRoomOId) 
    REFERENCES chatRooms(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 채팅방은 남아있어야 한다.
  CONSTRAINT fk_chatRoomRouter_userOId 
    FOREIGN KEY (userOId) 
    REFERENCES users(userOId),

  -- 대상 유저가 삭제되어도 채팅방은 남아있어야 한다.
  CONSTRAINT fk_chatRoomRouter_targetUserOId 
    FOREIGN KEY (targetUserOId) 
    REFERENCES users(userOId)
)   CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `chats` (
  chatRoomOId CHAR(24) NOT NULL,
  chatIdx INT NOT NULL,

  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,

  CONSTRAINT chat_pk PRIMARY KEY (chatRoomOId, chatIdx),

  CONSTRAINT fk_chat_chatRoomOId 
    FOREIGN KEY (chatRoomOId) 
    REFERENCES chatRooms(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 채팅은 남아있어야 한다.
  CONSTRAINT fk_chat_userOId 
    FOREIGN KEY (userOId) 
    REFERENCES users(userOId),

  -- 유저가 삭제되어도 채팅은 남아있어야 한다.
  CONSTRAINT fk_chat_userName 
    FOREIGN KEY (userName) 
    REFERENCES users(userName)
)   CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;