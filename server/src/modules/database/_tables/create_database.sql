CREATE DATABASE IF NOT EXISTS `kyhblog`;
USE `kyhblog`;

CREATE TABLE `users` (
  userOId CHAR(24) PRIMARY KEY,
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  hashedPassword VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NULL,
  signUpType ENUM('common', 'google') NOT NULL,
  userAuth TINYINT UNSIGNED NOT NULL DEFAULT 1,
  userId VARCHAR(32) NOT NULL,
  userMail VARCHAR(255) NOT NULL,
  userName VARCHAR(64) NOT NULL,
  CONSTRAINT unique_userId UNIQUE (userId),
  CONSTRAINT unique_userMail UNIQUE (userMail),
  CONSTRAINT unique_userName UNIQUE (userName),
  CONSTRAINT chk_userId_alnum CHECK (userId REGEXP '^[a-zA-Z0-9_.]+$'),
  CONSTRAINT chk_userMail_email CHECK (userMail REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$')
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `directories` (
  dirOId CHAR(24) PRIMARY KEY,
  dirIdx INT UNSIGNED NOT NULL,
  dirName VARCHAR(127) NOT NULL,
  fileArrLen INT UNSIGNED NOT NULL DEFAULT 0,
  parentDirOId CHAR(24) DEFAULT NULL,
  subDirArrLen INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT same_parent_different_dirname UNIQUE (parentDirOId, dirName),
  CONSTRAINT fk_parent_directory
    FOREIGN KEY (parentDirOId)
    REFERENCES directories(dirOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `files` (
  fileOId CHAR(24) PRIMARY KEY,
  content MEDIUMTEXT NOT NULL,
  dirOId CHAR(24) NOT NULL,
  fileIdx INT UNSIGNED NOT NULL,
  fileName VARCHAR(127) NOT NULL,
  fileStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,
  userName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT uq_dir_fileName UNIQUE (dirOId, fileName),
  CONSTRAINT fk_file_dir_oid
    FOREIGN KEY (dirOId)
    REFERENCES directories(dirOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `comments` (
  commentOId CHAR(24) PRIMARY KEY,
  content TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  fileOId CHAR(24) NOT NULL,
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,
  CONSTRAINT fk_fileOId_in_comments
    FOREIGN KEY (fileOId)
    REFERENCES files(fileOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_userOId_in_comments
    FOREIGN KEY (userOId)
    REFERENCES users(userOId)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `replies` (
  replyOId CHAR(24) PRIMARY KEY,
  commentOId CHAR(24) NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  fileOId CHAR(24) NOT NULL,
  targetUserOId CHAR(24) NOT NULL,
  targetUserName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,
  CONSTRAINT fk_commentOId_in_replies
    FOREIGN KEY (commentOId)
    REFERENCES comments(commentOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_targetUserOId_in_replies
    FOREIGN KEY (targetUserOId)
    REFERENCES users(userOId),
  CONSTRAINT fk_userOId_in_replies
    FOREIGN KEY (userOId)
    REFERENCES users(userOId)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `chatRooms` (
  chatRoomOId CHAR(24) PRIMARY KEY,
  lastChatDate DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  numChat INT DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `chatRoomRouters` (
  chatRoomOId CHAR(24) NOT NULL,
  roomStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,
  targetUserOId CHAR(24) NOT NULL,
  unreadMessageCount INT DEFAULT 0,
  userOId CHAR(24) NOT NULL,
  CONSTRAINT chatRoomRouter_pk PRIMARY KEY (userOId, targetUserOId),
  CONSTRAINT unique_user_room UNIQUE (userOId, chatRoomOId),
  CONSTRAINT unique_target_room UNIQUE (targetUserOId, chatRoomOId),
  CONSTRAINT fk_chatRoomRouter_chatRoomOId
    FOREIGN KEY (chatRoomOId)
    REFERENCES chatRooms(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_chatRoomRouter_userOId
    FOREIGN KEY (userOId)
    REFERENCES users(userOId),
  CONSTRAINT fk_chatRoomRouter_targetUserOId
    FOREIGN KEY (targetUserOId)
    REFERENCES users(userOId)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `chats` (
  chatRoomOId CHAR(24) NOT NULL,
  chatIdx INT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,
  CONSTRAINT chat_pk PRIMARY KEY (chatRoomOId, chatIdx),
  CONSTRAINT fk_chat_chatRoomOId
    FOREIGN KEY (chatRoomOId)
    REFERENCES chatRooms(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_chat_userOId
    FOREIGN KEY (userOId)
    REFERENCES users(userOId),
  CONSTRAINT fk_chat_userName
    FOREIGN KEY (userName)
    REFERENCES users(userName)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `alarms` (
  alarmOId CHAR(24) PRIMARY KEY,
  alarmStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,
  alarmType TINYINT UNSIGNED NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  fileOId CHAR(24) NOT NULL,
  senderUserName VARCHAR(64) NOT NULL,
  senderUserOId CHAR(24) NOT NULL,
  userOId CHAR(24) NOT NULL,
  CONSTRAINT fk_alarm_fileOId
    FOREIGN KEY (fileOId)
    REFERENCES files(fileOId)
    ON UPDATE CASCADE,
  CONSTRAINT fk_alarm_senderUserOId
    FOREIGN KEY (senderUserOId)
    REFERENCES users(userOId)
    ON UPDATE CASCADE,
  CONSTRAINT fk_alarm_userOId
    FOREIGN KEY (userOId)
    REFERENCES users(userOId)
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `logs` (
  date DATETIME(3) NOT NULL,
  gkdErrCode VARCHAR(127) DEFAULT NULL,
  gkdErrMsg VARCHAR(255) DEFAULT NULL,
  gkdLog TEXT NOT NULL,
  logOId CHAR(24) PRIMARY KEY,
  userId VARCHAR(32) NOT NULL,
  userName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,
  `where` TEXT NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `errobjs` (
  logOId CHAR(24) NOT NULL,
  `key` VARCHAR(63) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  CONSTRAINT fk_logOId_in_errobjs
    FOREIGN KEY (logOId)
    REFERENCES `logs`(logOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `gkds` (
  logOId CHAR(24) NOT NULL,
  `key` VARCHAR(63) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  CONSTRAINT fk_logOId_in_gkds
    FOREIGN KEY (logOId)
    REFERENCES `logs`(logOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `gkdStatus` (
  logOId CHAR(24) NOT NULL,
  `key` VARCHAR(63) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  CONSTRAINT fk_logOId_in_gkdStatus
    FOREIGN KEY (logOId)
    REFERENCES `logs`(logOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;