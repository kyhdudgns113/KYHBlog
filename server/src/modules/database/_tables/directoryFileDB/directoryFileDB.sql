CREATE TABLE `directories` (
  dirOId CHAR(24) PRIMARY KEY,

  dirIdx INT UNSIGNED NOT NULL, -- 이건 중복체크 안한다. 업데이트 쿼리를 한 번에 날릴 수 있기 때문이다.
  dirName VARCHAR(127) NOT NULL,
  fileArrLen INT UNSIGNED NOT NULL DEFAULT 0,

  parentDirOId CHAR(24) DEFAULT NULL,
  subDirArrLen INT UNSIGNED NOT NULL DEFAULT 0,

  CONSTRAINT same_parent_different_dirname
    UNIQUE (parentDirOId, dirName),

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

  -- UNIQUE 제약조건
  CONSTRAINT uq_dir_fileName UNIQUE (dirOId, fileName),

  -- 외부키: files.dirOId → directories.dirOId
  CONSTRAINT fk_file_dir_oid
    FOREIGN KEY (dirOId)
    REFERENCES directories(dirOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
