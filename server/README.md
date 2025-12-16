# KYHBlog Backend

NestJS 기반 RESTful API 서버

## 기술 스택

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Database**: MySQL 8.0
- **Authentication**: JWT, Passport.js, Google OAuth 2.0
- **Real-time**: Socket.io
- **API Documentation**: Swagger

## 프로젝트 구조

```
server/
├── src/
│   ├── common/              # 공통 모듈
│   │   ├── filters/        # 예외 필터
│   │   ├── guards/         # 인증/인가 가드
│   │   ├── types/          # 타입 정의
│   │   ├── utils/          # 유틸리티 함수
│   │   └── values/         # 상수 값
│   │
│   ├── modules/            # 기능 모듈
│   │   ├── client/         # API 엔드포인트
│   │   │   ├── client.auth/      # 인증
│   │   │   ├── client.user/      # 사용자 관리
│   │   │   ├── client.file/      # 파일 관리
│   │   │   ├── client.directory/ # 디렉토리 관리
│   │   │   ├── client.chat/      # 채팅
│   │   │   └── client.qna/       # Q&A
│   │   │
│   │   ├── database/       # 데이터베이스 레이어
│   │   │   ├── _tables/   # 테이블별 서비스
│   │   │   ├── dbHub/     # 데이터베이스 허브
│   │   │   └── ports/     # 포트 서비스
│   │   │
│   │   ├── socket/         # Socket.io 게이트웨이
│   │   ├── gkdJwt/         # JWT 서비스
│   │   ├── gkdLock/        # 락 서비스
│   │   ├── gkdLog/         # 로깅 서비스
│   │   └── worker/         # 워커 서비스
│   │
│   ├── app.module.ts       # 루트 모듈
│   └── main.ts            # 진입점
│
└── test/                  # 테스트 코드
```

## 시작하기

### 1. Secret 파일 설정

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다.

`src/common/secret/` 디렉토리의 파일들을 수정하세요:

- **`urlInfo.ts`**: 데이터베이스 연결 정보 및 서버 URL 설정
- **`jwtInfo.ts`**: JWT Secret 및 인증 설정
- **`baseInfo.ts`**: 애플리케이션 기본 설정
- **`googles.ts`**: Google OAuth 설정 (선택사항)

자세한 설정 방법은 루트 디렉토리의 [SETUP.md](../../SETUP.md)를 참고하세요.

### 2. 데이터베이스 설정

MySQL 데이터베이스를 생성하고 스키마를 적용하세요:

```sql
CREATE DATABASE KYHBlog;
CREATE DATABASE KYHBlogTest;
```

`src/modules/database/_tables/` 디렉토리의 각 SQL 파일을 실행하여 테이블을 생성하세요.

### 3. 의존성 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run start:dev
```

서버는 기본적으로 `http://localhost:4123`에서 실행됩니다.

## API 문서

서버 실행 후 Swagger API 문서를 확인할 수 있습니다:

```
http://localhost:4123/api
```

## 주요 모듈 설명

### 인증/인가 (Authentication & Authorization)

- **JWT 기반 인증**: 토큰 기반 인증 시스템
- **Google OAuth 2.0**: 소셜 로그인 지원
- **Guard 시스템**: 
  - `CheckJwtValidationGuard`: JWT 검증
  - `CheckAdminGuard`: 관리자 권한 체크

### 데이터베이스 레이어

- **DB Service**: MySQL 연결 풀 관리
- **DB Hub**: 비즈니스 로직 처리
- **Port Service**: 모듈별 데이터 접근 인터페이스

### 실시간 통신

- **Socket Gateway**: Socket.io 게이트웨이
- **실시간 채팅**: 사용자 간 실시간 메시징
- **알림 시스템**: 실시간 알림 전송

## 테스트

이 프로젝트는 커스텀 테스트 프레임워크와 Jest를 함께 사용합니다.

### 테스트 모듈 구조

- **커스텀 테스트 프레임워크**: `GKDTestBase`를 상속받은 모듈화된 테스트 구조
- **테스트 DB 관리**: 자동 초기화 및 정리 기능 제공
- **로그 레벨 제어**: 테스트 실행 시 상세 로그 출력 레벨 조절 가능

자세한 내용은 [`test/README.md`](./test/README.md)를 참고하세요.

### 단위 테스트 실행

```bash
npm test
```

### 커버리지 포함 테스트

```bash
npm run test:cov
```

### E2E 테스트

```bash
npm run test:e2e
```

### 커스텀 테스트 실행

```bash
npm run gkd              # 전체 테스트
npm run gkd:cov          # 커버리지 포함
npm run gkd1 ~ gkd10     # 로그 레벨별 실행
```

## 스크립트

- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 모드 실행
- `npm run start:dev`: 개발 모드 실행 (watch)
- `npm run start:debug`: 디버그 모드 실행
- `npm run lint`: ESLint 실행
- `npm run format`: Prettier 포맷팅

## Secret 파일

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다.

주요 설정 파일:

- **`src/common/secret/urlInfo.ts`**: 
  - MySQL 연결 정보 (`mysqlHost`, `mysqlID`, `mysqlPW`, `mysqlDB`, `mysqlPort`)
  - 서버 및 클라이언트 URL (`serverPort`, `clientIP`, `serverIP`)

- **`src/common/secret/jwtInfo.ts`**: 
  - JWT Secret (`gkdJwtSecret`)
  - JWT 만료 시간 (`gkdJwtSignOption`)
  - 비밀번호 해싱 설정 (`gkdSaltOrRounds`)

- **`src/common/secret/baseInfo.ts`**: 
  - 관리자 사용자 ID (`adminUserId`)
  - 디버그 모드 (`DEBUG_MODE`)

- **`src/common/secret/googles.ts`**: 
  - Google OAuth 클라이언트 ID 및 시크릿

**중요**: Secret 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 실제 값으로 수정해야 합니다.

## 아키텍처 패턴

### 레이어드 아키텍처

```
Controller → Service → Port → DB Hub → DB Service
```

- **Controller**: HTTP 요청/응답 처리
- **Service**: 비즈니스 로직
- **Port**: 데이터 접근 인터페이스
- **DB Hub**: 데이터베이스 작업 중앙화
- **DB Service**: 실제 데이터베이스 연결

### 모듈 구조

각 기능은 독립적인 모듈로 구성되어 있습니다:
- `Module`: 모듈 정의 및 의존성 주입
- `Controller`: 라우트 핸들러
- `Service`: 비즈니스 로직
- `Port`: 데이터 접근 계층

## 보안

- JWT 토큰 기반 인증
- 비밀번호 bcrypt 해싱 (salt rounds: 14)
- CORS 설정
- SQL Injection 방지 (Prepared Statements)
- 전역 예외 필터를 통한 에러 처리

## 로깅

- `GKDLog` 모듈을 통한 구조화된 로깅
- 로그 레벨별 관리

## 라이선스

개인 포트폴리오 용도
