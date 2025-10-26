CREATE TABLE `comments` (
  commentOId CHAR(24) PRIMARY KEY,

  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fileOId CHAR(24) NOT NULL,
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,

  CONSTRAINT fk_fileOId_in_comments
    FOREIGN KEY (fileOId) 
    REFERENCES files(fileOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 댓글은 남아있어야 한다.
  CONSTRAINT fk_userOId_in_comments
    FOREIGN KEY (userOId) 
    REFERENCES users(userOId)
)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `replies` (
  replyOId CHAR(24) PRIMARY KEY,

  commentOId CHAR(24) NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
