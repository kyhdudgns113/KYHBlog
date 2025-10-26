CREATE TABLE `alarms` (
  alarmOId CHAR(24) PRIMARY KEY,

  alarmStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,
  alarmType TINYINT UNSIGNED NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
