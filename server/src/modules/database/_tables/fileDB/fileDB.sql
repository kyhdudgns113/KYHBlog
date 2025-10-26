CREATE TABLE `files` (
  fileOId CHAR(24) PRIMARY KEY,

  content MEDIUMTEXT NOT NULL,
  dirOId CHAR(24) NOT NULL,

  fileIdx INT UNSIGNED NOT NULL,
  fileName VARCHAR(127) NOT NULL,
  fileStatus TINYINT UNSIGNED NOT NULL DEFAULT 0,

  userName VARCHAR(64) NOT NULL,
  userOId CHAR(24) NOT NULL,

  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- UNIQUE 제약조건
  CONSTRAINT uq_dir_fileName UNIQUE (dirOId, fileName),

  -- 외부키: files.dirOId → directories.dirOId
  CONSTRAINT fk_file_dir_oid
    FOREIGN KEY (dirOId)
    REFERENCES directories(dirOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;