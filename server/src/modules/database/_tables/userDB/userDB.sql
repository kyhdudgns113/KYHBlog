CREATE TABLE `users` (
	userOId CHAR(24) PRIMARY KEY,

  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,

  hashedPassword VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NULL,
  signUpType ENUM('common', 'google') NOT NULL,
  
  userAuth TINYINT UNSIGNED NOT NULL DEFAULT 1,
  userId VARCHAR(32) NOT NULL,
  userMail VARCHAR(255) NOT NULL,
  userName VARCHAR(64) NOT NULL,

  CONSTRAINT unique_userId
    UNIQUE (userId),
  CONSTRAINT unique_userMail
    UNIQUE (userMail),
  CONSTRAINT unique_userName
    UNIQUE (userName),

  CONSTRAINT chk_userId_alnum CHECK (userId REGEXP '^[a-zA-Z0-9]+$'),
  CONSTRAINT chk_userMail_email CHECK (userMail REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$')
) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;