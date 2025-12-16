CREATE TABLE `qnas` (
  qnAOId CHAR(24) PRIMARY KEY,

  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  isPrivate BOOLEAN NOT NULL DEFAULT FALSE,
  viewCount INT UNSIGNED NOT NULL DEFAULT 0,

  userName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,

  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  -- 유저가 삭제되어도 QnA는 남아있어야 한다.
  CONSTRAINT fk_userOId_in_qnas
    FOREIGN KEY (userOId) 
    REFERENCES users(userOId)

)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

CREATE TABLE `qnaComments` (
  qCommentOId CHAR(24) PRIMARY KEY,

  qnAOId CHAR(24) NOT NULL,
  targetQCommentOId CHAR(24) NULL,
  content TEXT NOT NULL,

  userName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,

  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_qnAOId_in_qnaComments
    FOREIGN KEY (qnAOId) 
    REFERENCES qnas(qnAOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_targetQCommentOId_in_qnaComments
    FOREIGN KEY (targetQCommentOId) 
    REFERENCES qnaComments(qCommentOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 댓글은 남아있어야 한다.
  CONSTRAINT fk_userOId_in_qnaComments
    FOREIGN KEY (userOId) 
    REFERENCES users(userOId)

)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

