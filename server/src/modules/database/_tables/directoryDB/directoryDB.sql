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