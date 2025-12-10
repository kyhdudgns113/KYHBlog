# 개발 환경 설정 가이드

KYHBlog 프로젝트를 로컬 환경에서 실행하기 위한 상세 가이드입니다.

## 목차

1. [사전 요구사항](#사전-요구사항)
2. [Secret 파일 설정](#secret-파일-설정)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [프로젝트 실행](#프로젝트-실행)
5. [문제 해결](#문제-해결)

## 사전 요구사항

### 필수 소프트웨어

- **Node.js**: 18.x 이상
  - 설치 확인: `node --version`
  - 다운로드: [nodejs.org](https://nodejs.org/)

- **npm**: Node.js와 함께 설치됨
  - 설치 확인: `npm --version`

- **MySQL**: 8.0 이상
  - 설치 확인: `mysql --version`
  - 다운로드: [mysql.com](https://dev.mysql.com/downloads/mysql/)

- **Git**: 버전 관리
  - 설치 확인: `git --version`
  - 다운로드: [git-scm.com](https://git-scm.com/)

### 선택적 소프트웨어

- **VS Code**: 추천 에디터
  - 다운로드: [code.visualstudio.com](https://code.visualstudio.com/)

## Secret 파일 설정

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다. `server/src/common/secret/` 디렉토리의 파일들을 수정하세요.

### Backend Secret 파일 설정

`server/src/common/secret/` 디렉토리에 다음 파일들이 있습니다:

#### 1. `urlInfo.ts` - 데이터베이스 및 서버 설정

```typescript
// MySQL 설정
export const mysqlHost = '127.0.0.1'
export const mysqlID = 'your_username'
export const mysqlPW = 'your_password'
export const mysqlDB = 'KYHBlog'
export const mysqlPort = 3306

// 테스트 데이터베이스 설정
export const mysqlTestHost = '127.0.0.1'
export const mysqlTestID = 'your_username'
export const mysqlTestPW = 'your_password'
export const mysqlTestDB = 'KYHBlogTest'
export const mysqlTestPort = 3306

// 서버 및 클라이언트 URL 설정
export const clientIP = 'http://localhost:3333'
export const clientTestIP = 'http://localhost:3330'
export const clientTestIP2 = 'http://localhost:3329'
export const serverIP = '127.0.0.1'
export const serverPort = 4123
```

#### 2. `jwtInfo.ts` - JWT 설정

```typescript
// JWT Secret 및 설정
export const gkdJwtSecret = 'your_secure_jwt_secret_key_minimum_32_characters'
export const gkdJwtSignOption: JwtModuleOptions['signOptions'] = {
  expiresIn: '48h'
}
export const gkdSaltOrRounds = 14

// 권한 상수
export const [AUTH_ADMIN, AUTH_USER, AUTH_GUEST] = [100, 1, 0]
export const USER_ID_ADMIN = 'your_admin_user_id'
```

#### 3. `baseInfo.ts` - 애플리케이션 설정

```typescript
export const adminUserId = 'your_admin_user_id'

// 파일 상태 상수
export const [FILE_NORMAL, FILE_HIDDEN, FILE_NOTICE] = [0, 1, 2]

// 디버그 모드
export const DEBUG_MODE = true
```

#### 4. `googles.ts` - Google OAuth 설정 (선택사항)

```typescript
export const googleClientId = 'your_google_client_id'
export const googleClientSecret = 'your_google_client_secret'
```

**중요**: 
- 실제 값으로 변경하세요
- `gkdJwtSecret`은 강력한 랜덤 문자열을 사용하세요
- 데이터베이스 비밀번호는 안전하게 관리하세요
- Secret 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다

### Frontend Secret 파일 설정

`client/src/base/secret/` 디렉토리의 파일들을 수정하세요:

#### `urlInfo.ts` - 서버 URL 설정

```typescript
export const clientIP = 'localhost'
export const clientPort = 3333
export const serverIP = 'localhost'
export const serverPort = 4123
export const serverUrl = `http://${serverIP}:${serverPort}`
```

#### `baseInfo.ts` - 클라이언트 설정

```typescript
export const DEBUG_MODE = true
```

## 데이터베이스 설정

### MySQL 데이터베이스 생성

1. MySQL에 접속:

```bash
mysql -u root -p
```

2. 데이터베이스 생성:

```sql
CREATE DATABASE KYHBlog;
CREATE DATABASE KYHBlogTest;
```

3. 사용자 생성 및 권한 부여 (선택사항):

```sql
CREATE USER 'kyh_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON KYHBlog.* TO 'kyh_user'@'localhost';
GRANT ALL PRIVILEGES ON KYHBlogTest.* TO 'kyh_user'@'localhost';
FLUSH PRIVILEGES;
```

### 테이블 생성

`server/src/modules/database/_tables/` 디렉토리의 각 SQL 파일을 순서대로 실행하세요:

1. `userDB/userDB.sql`
2. `directoryDB/directoryDB.sql`
3. `fileDB/fileDB.sql`
4. `commentDB/commentDB.sql`
5. `qnaDB/qnaDB.sql`
6. `chatDB/chatDB.sql`
7. `alarmDB/alarmDB.sql`
8. `logDB/logDB.sql`

각 SQL 파일을 실행:

```bash
mysql -u your_username -p KYHBlog < server/src/modules/database/_tables/userDB/userDB.sql
```

또는 MySQL 클라이언트에서:

```sql
USE KYHBlog;
SOURCE server/src/modules/database/_tables/userDB/userDB.sql;
```

## 프로젝트 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd KYHBlog
```

### 2. Backend 설정 및 실행

```bash
cd server

# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev
```

서버가 성공적으로 실행되면 다음 메시지가 표시됩니다:

```
[Nest] INFO [NestApplication] Nest application successfully started
```

서버는 `http://localhost:4123`에서 실행됩니다.

### 3. Frontend 설정 및 실행

새 터미널 창에서:

```bash
cd client

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

클라이언트가 성공적으로 실행되면 다음 메시지가 표시됩니다:

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:3333/
```

### 4. 브라우저에서 확인

- **Frontend**: http://localhost:3333
- **Backend API**: http://localhost:4123
- **Swagger API 문서**: http://localhost:4123/api

## 문제 해결

### 포트가 이미 사용 중인 경우

**Backend 포트 변경**:
- `server/src/common/secret/urlInfo.ts`에서 `serverPort` 값 변경

**Frontend 포트 변경**:
- `client/vite.config.ts`에서 포트 설정 변경
- 또는 `npm run dev -- --port 3334`

### 데이터베이스 연결 오류

1. MySQL 서버가 실행 중인지 확인:

```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
# 또는
sudo service mysql start
```

2. 사용자명과 비밀번호가 올바른지 확인
3. 데이터베이스가 생성되었는지 확인
4. 방화벽 설정 확인

### 모듈을 찾을 수 없는 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 오류

```bash
# 타입 체크
npm run build

# 또는
npx tsc --noEmit
```

### CORS 오류

`server/src/main.ts`에서 CORS 설정 확인:

```typescript
const corsOptions: CorsOptions = {
  origin: [clientIP, clientTestIP, clientTestIP2],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}
```

클라이언트 URL이 `origin` 배열에 포함되어 있는지 확인하세요.

### JWT 토큰 오류

1. `server/src/common/secret/jwtInfo.ts`에서 `gkdJwtSecret`이 설정되었는지 확인
2. 토큰이 만료되지 않았는지 확인
3. 브라우저 개발자 도구에서 토큰 확인

## 추가 설정

### Google OAuth 설정 (선택사항)

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가: `http://localhost:4123/auth/google/callback`
4. `server/src/common/secret/googles.ts`에 클라이언트 ID와 시크릿 추가

### 프로덕션 빌드

**Backend**:

```bash
cd server
npm run build
npm run start:prod
```

**Frontend**:

```bash
cd client
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 다음 단계

- [README.md](./README.md) - 프로젝트 개요
- [server/README.md](./server/README.md) - 백엔드 상세 문서
- [client/README.md](./client/README.md) - 프론트엔드 상세 문서

## 도움이 필요하신가요?

문제가 발생하면 다음을 확인하세요:

1. 모든 사전 요구사항이 설치되었는지
2. Secret 파일들이 올바르게 설정되었는지
3. 데이터베이스가 실행 중이고 접근 가능한지
4. 포트가 사용 가능한지

추가 도움이 필요하면 이슈를 생성해주세요.
