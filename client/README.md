# KYHBlog Frontend

React + TypeScript + Vite 기반 프론트엔드 애플리케이션

## 기술 스택

- **Framework**: React 19.x
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.x
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 7.x
- **Styling**: SCSS, Tailwind CSS 4.x
- **Markdown**: react-markdown, react-syntax-highlighter
- **Real-time**: Socket.io Client

## 프로젝트 구조

```
client/
├── src/
│   ├── base/              # 공통 모듈
│   │   ├── components/    # 공통 컴포넌트
│   │   ├── fetch/         # API 호출 유틸리티
│   │   ├── guards/       # 라우트 가드
│   │   ├── styles/       # 전역 스타일
│   │   ├── types/        # 타입 정의
│   │   ├── utils/        # 유틸리티 함수
│   │   └── values/       # 상수 값
│   │
│   ├── manager/          # 상태 관리
│   │   ├── contexts/     # React Context
│   │   │   ├── auth/     # 인증 컨텍스트
│   │   │   ├── user/     # 사용자 컨텍스트
│   │   │   ├── file/     # 파일 컨텍스트
│   │   │   ├── chat/     # 채팅 컨텍스트
│   │   │   └── ...
│   │   └── redux/        # Redux 스토어
│   │
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── auth/         # 인증 페이지
│   │   ├── blog/         # 블로그 페이지
│   │   ├── qna/          # Q&A 페이지
│   │   └── ...
│   │
│   ├── template/         # 레이아웃 컴포넌트
│   │   ├── Header/       # 헤더
│   │   ├── Footer/       # 푸터
│   │   ├── Lefter/       # 왼쪽 사이드바
│   │   ├── Righter/      # 오른쪽 사이드바
│   │   └── Tabs/         # 탭 네비게이션
│   │
│   ├── App.tsx           # 루트 컴포넌트
│   └── main.tsx          # 진입점
│
└── package.json
```

## 시작하기

### 1. Secret 파일 설정

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다.

`src/base/secret/` 디렉토리의 파일들을 수정하세요:

- **`urlInfo.ts`**: 서버 URL 및 포트 설정
- **`baseInfo.ts`**: 클라이언트 기본 설정 (디버그 모드 등)

자세한 설정 방법은 루트 디렉토리의 [SETUP.md](../../SETUP.md)를 참고하세요.

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

클라이언트는 기본적으로 `http://localhost:3333`에서 실행됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 주요 기능

### 인증/인가

- JWT 토큰 기반 인증
- 로그인/회원가입
- Google OAuth 2.0 연동
- 토큰 갱신 메커니즘
- 라우트 가드를 통한 접근 제어

### 상태 관리

- **Redux Toolkit**: 전역 상태 관리
- **React Context**: 모듈별 로컬 상태 관리
  - Auth Context: 인증 상태
  - User Context: 사용자 정보
  - File Context: 파일 관리 상태
  - Chat Context: 채팅 상태
  - Directory Context: 디렉토리 상태
  - Comment Context: 댓글 상태
  - QnA Context: Q&A 상태

### 실시간 통신

- Socket.io Client를 통한 실시간 채팅
- 실시간 알림 수신
- 사용자 상태 동기화

### UI 컴포넌트

- **Markdown 렌더링**: react-markdown 활용
- **코드 하이라이팅**: react-syntax-highlighter
- **모달 시스템**: 커스텀 모달 컴포넌트
- **반응형 디자인**: Tailwind CSS 활용

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 미리보기
- `npm run lint`: ESLint 실행

## Secret 파일

이 프로젝트는 환경 변수 대신 secret 파일을 사용합니다.

주요 설정 파일:

- **`src/base/secret/urlInfo.ts`**: 
  - 서버 URL 설정 (`serverIP`, `serverPort`, `serverUrl`)
  - 클라이언트 설정 (`clientIP`, `clientPort`)

- **`src/base/secret/baseInfo.ts`**: 
  - 디버그 모드 (`DEBUG_MODE`)

**중요**: Secret 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 실제 값으로 수정해야 합니다.

## API 통신

### Fetch 유틸리티

`src/base/fetch/` 디렉토리에 API 호출 유틸리티가 있습니다:

- `getAndDel.ts`: GET, DELETE 요청
- `postAndPut.ts`: POST, PUT 요청
- `getServerUrl.ts`: 서버 URL 관리

### 사용 예시

```typescript
import { getData, deleteData } from '@base/fetch'
import { postData, putData } from '@base/fetch'

// GET 요청
const data = await getData('/client/user/profile')

// POST 요청
const result = await postData('/client/auth/logIn', { userId, password })

// PUT 요청
await putData('/client/file/edit', { fileId, content })

// DELETE 요청
await deleteData('/client/file/delete', { fileId })
```

## 스타일링

- **SCSS**: 컴포넌트별 스타일 파일
- **Tailwind CSS**: 유틸리티 클래스 활용
- **CSS Modules**: 스타일 격리

## 라우팅

React Router DOM을 사용한 클라이언트 사이드 라우팅:

```typescript
// 라우트 가드를 통한 인증 체크
<CheckAuth>
  <Route path="/blog" element={<BlogPage />} />
</CheckAuth>
```

## 타입 안정성

TypeScript를 활용한 타입 안정성:

- API 응답 타입 정의
- 컴포넌트 Props 타입 정의
- 상태 관리 타입 정의

## 성능 최적화

- Vite를 통한 빠른 빌드
- 코드 스플리팅
- 이미지 최적화
- 불필요한 리렌더링 방지

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

개인 포트폴리오 용도
