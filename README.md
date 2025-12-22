# KYHBlog - 풀스택 블로그 프로젝트

> NestJS와 React를 활용한 모던 웹 블로그 플랫폼

## 📋 프로젝트 소개

KYHBlog는 NestJS 백엔드와 React 프론트엔드를 활용하여 개발된 풀스택 블로그 플랫폼입니다. 실시간 채팅, Q&A, 파일 관리, 댓글 시스템 등 다양한 기능을 제공합니다.

### 주요 기능

- 🔐 **인증/인가 시스템**: GKDoubleJWT 기반 인증, Google OAuth 2.0 연동
- 💬 **실시간 채팅**: Socket.io를 활용한 실시간 메시징
- 📝 **블로그 관리**: 마크다운 지원, 파일 업로드/다운로드
- 💭 **댓글 시스템**: 댓글 및 답글 기능
- ❓ **Q&A 게시판**: 질문과 답변 관리
- 📁 **디렉토리 관리**: 계층적 파일/폴더 구조 관리
- 🔔 **알림 시스템**: 실시간 알림 기능
- 👤 **사용자 관리**: 권한 기반 사용자 관리 (관리자/일반 사용자)

## 🛠 기술 스택

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **Authentication**: GKDoubleJWT, Passport.js, Google OAuth 2.0
- **API Documentation**: Swagger
- **Testing**: Custom 모듈

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: SCSS
- **Markdown**: react-markdown, react-syntax-highlighter
- **Real-time**: Socket.io Client

## 📁 프로젝트 구조

```
KYHBlog/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── base/          # 공통 컴포넌트, 유틸리티
│   │   ├── manager/       # 상태 관리 (Redux, Context)
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── template/      # 레이아웃 컴포넌트
│   └── package.json
│
├── server/                 # NestJS 백엔드
│   ├── src/
│   │   ├── common/        # 공통 모듈 (guards, filters, utils)
│   │   ├── modules/       # 기능 모듈
│   │   │   ├── client/    # API 엔드포인트
│   │   │   ├── database/  # 데이터베이스 레이어
│   │   │   ├── socket/    # Socket.io 게이트웨이
│   │   │   └── ...
│   │   └── main.ts
│   ├── test/              # 테스트 코드
│   └── package.json
│
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- MySQL 8.0

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd KYHBlog
```

#### 2. Secret 파일 설정

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다.

**Backend Secret 파일 설정**
- `server/src/common/secret/urlInfo.ts`: 데이터베이스 및 서버 URL 설정
- `server/src/common/secret/jwtInfo.ts`: JWT Secret 및 설정
- `server/src/common/secret/baseInfo.ts`: 애플리케이션 기본 설정
- `server/src/common/secret/googles.ts`: Google OAuth 설정 (선택사항)

**Frontend Secret 파일 설정**
- `client/src/base/secret/urlInfo.ts`: 서버 URL 설정
- `client/src/base/secret/baseInfo.ts`: 클라이언트 기본 설정

자세한 설정 방법은 [SETUP.md](./SETUP.md)를 참고하세요.

#### 3. 데이터베이스 설정

MySQL 데이터베이스를 생성하고 스키마를 적용하세요:

```bash
# MySQL 접속 후
CREATE DATABASE KYHBlog;
# server/src/modules/database/_tables/ 디렉토리의 SQL 파일들을 실행
```

#### 4. 의존성 설치 및 실행

**Backend 실행**
```bash
cd server
npm install
npm run start:dev
```

**Frontend 실행**
```bash
cd client
npm install
npm run dev
```

서버는 `http://localhost:4123`에서 실행되고, 클라이언트는 `http://localhost:3333`에서 실행됩니다.

## 📚 API 문서

서버 실행 후 Swagger API 문서를 확인할 수 있습니다:

```
http://localhost:4123/api
```

## 🧪 테스트

### Backend 테스트 실행

```bash
cd server
npm run gkd:cov       # 커버리지 확인 테스트, LOG_LEVEL = 0 : 기초 로그만 나옴
npm run gkd           # 테스트, LOG_LEVEL = 0: 기초 로그만 나옴
npm run gkd1          # 테스트, LOG_LEVEL = 1
npm run gkd2          # 테스트, LOG_LEVEL = 2
npm run gkd3          # 테스트, LOG_LEVEL = 3
npm run gkd4          # 테스트, LOG_LEVEL = 4
npm run gkd5          # 테스트, LOG_LEVEL = 5
npm run gkd6          # 테스트, LOG_LEVEL = 6
npm run gkd7          # 테스트, LOG_LEVEL = 7
npm run gkd8          # 테스트, LOG_LEVEL = 8
npm run gkd9          # 테스트, LOG_LEVEL = 9
npm run gkd10         # 테스트, LOG_LEVEL = 10
npm run gkdDefault    # 기본 테스트
```

### 테스트 커버리지

현재 프로젝트에는 130개 이상의 테스트 파일이 포함되어 있습니다:
- 인증/인가 테스트
- 파일 관리 테스트
- 디렉토리 관리 테스트
- 댓글 시스템 테스트
- Q&A 테스트

## 🏗 아키텍처

### Backend 아키텍처

- **모듈 기반 구조**: NestJS의 모듈 시스템 활용
- **레이어드 아키텍처**: Controller → Service → Port → DB Service
- **Guard 기반 인증**: JWT 검증 및 권한 체크
- **Exception Filter**: 전역 예외 처리
- **Connection Pooling**: MySQL 연결 풀 관리

### Frontend 아키텍처

- **컴포넌트 기반**: 재사용 가능한 컴포넌트 구조
- **상태 관리**: Redux Toolkit + React Context
- **라우팅**: React Router DOM
- **실시간 통신**: Socket.io Client

## 🔒 보안

- JWT 기반 인증
- 비밀번호 bcrypt 해싱 (salt rounds: 14)
- CORS 설정
- SQL Injection 방지 (Prepared Statements)
- XSS 방지 (입력값 검증)

## 📝 주요 구현 사항

### 인증/인가
- JWT 토큰 기반 인증
- 토큰 갱신 메커니즘
- Google OAuth 2.0 연동
- 권한 기반 접근 제어 (관리자/일반 사용자)

### 실시간 통신
- Socket.io를 활용한 실시간 채팅
- 실시간 알림 시스템
- 사용자 상태 관리

### 파일 관리
- 파일 업로드/다운로드
- 디렉토리 계층 구조 관리
- 파일 권한 관리
- 마크다운 렌더링

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

## 👤 작성자

KYH

## 🙏 감사의 말

이 프로젝트를 통해 풀스택 개발 경험을 쌓았습니다.
