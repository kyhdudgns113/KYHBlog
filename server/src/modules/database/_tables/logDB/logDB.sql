CREATE TABLE `logs` (
    date DATETIME NOT NULL, -- date 직접 넣어주는게 서버 프로그램에서 데이터 관리에 좋다.
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