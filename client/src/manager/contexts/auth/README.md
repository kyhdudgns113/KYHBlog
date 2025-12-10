# Auth Context

인증 및 사용자 인가를 관리하는 Context입니다.

## 개요

Auth Context는 사용자 로그인, 로그아웃, 회원가입, 토큰 갱신 등의 인증 관련 기능을 제공합니다. JWT 토큰 기반 인증을 사용하며, 사용자 정보를 상태로 관리합니다.

## 파일 구조

```
auth/
├── __states.tsx      # 인증 상태 관리
├── _callbacks.tsx    # 인증 관련 콜백 함수
├── _effects.tsx     # 인증 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

인증 관련 상태를 관리합니다:

- `isLoggedIn`: 로그인 여부
- `picture`: 사용자 프로필 사진 URL
- `userAuth`: 사용자 권한 레벨 (AUTH_GUEST, AUTH_USER, AUTH_ADMIN)
- `userId`: 사용자 ID
- `userMail`: 사용자 이메일
- `userName`: 사용자 이름
- `userOId`: 사용자 Object ID

### 2. 콜백 함수 (`_callbacks.tsx`)

인증 관련 비즈니스 로직을 처리하는 함수들:

#### `logIn(userId: string, password: string): Promise<APIReturnType>`
- 사용자 로그인
- 성공 시 JWT 토큰 및 사용자 정보를 localStorage에 저장
- 상태 업데이트

**API 정보:**
- **엔드포인트**: `POST /client/auth/logIn`
- **Request Body**:
  ```typescript
  {
    userId: string    // 사용자 ID
    password: string  // 비밀번호
  }
  ```
- **Request Body 상세 규칙**:
  - `userId`:
    - 길이: 6자 이상 20자 이하
    - 형식: 영문 대소문자, 숫자, 언더바(_), 마침표(.)만 허용
    - 정규식: `/^[a-zA-Z0-9_.]+$/`
  - `password`:
    - 길이: 8자 이상 20자 이하
    - 형식: 영문 소문자, 영문 대문자, 숫자, 특수문자를 각각 1개 이상 포함해야 함
    - 정규식: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/`
- **Response Body**:
  ```typescript
  {
    user: {
      picture: string    // 프로필 사진 URL
      userAuth: number   // 사용자 권한 레벨
      userId: string     // 사용자 ID
      userMail: string   // 사용자 이메일
      userName: string   // 사용자 이름
      userOId: string    // 사용자 Object ID
    }
  }
  ```

#### `logOut(): void`
- 사용자 로그아웃
- localStorage 초기화
- 홈 페이지로 리다이렉트
- **API 호출 없음** (클라이언트에서만 처리)

#### `refreshToken(authLevel: number, errCallback?: CallbackType): Promise<number>`
- JWT 토큰 갱신
- 권한 레벨 검증
- 권한이 부족하면 에러 콜백 실행
- 반환값: 사용자 권한 레벨 (number)

**API 정보:**
- **엔드포인트**: `GET /client/auth/refreshToken`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
    - `Authorization: Bearer {jwtFromServer}`
  - Guard: `CheckJwtValidationGuard` 사용 (자동으로 JWT 검증 및 갱신)
- **Response Body**:
  ```typescript
  {
    user: {
      picture: string
      userAuth: number
      userId: string
      userMail: string
      userName: string
      userOId: string
    }
  }
  ```

#### `signUp(userId: string, userMail: string, userName: string, password: string): Promise<APIReturnType>`
- 사용자 회원가입
- 성공 시 자동 로그인 처리

**API 정보:**
- **엔드포인트**: `POST /client/auth/signUp`
- **Request Body**:
  ```typescript
  {
    userId: string    // 사용자 ID
    userMail: string  // 사용자 이메일
    userName: string  // 사용자 이름
    password: string  // 비밀번호
  }
  ```
- **Request Body 상세 규칙**:
  - `userId`:
    - 길이: 6자 이상 20자 이하
    - 형식: 영문 대소문자, 숫자, 언더바(_), 마침표(.)만 허용
    - 정규식: `/^[a-zA-Z0-9_.]+$/`
  - `userMail`:
    - 형식: 이메일 형식이어야 함
    - 정규식: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/`
  - `userName`:
    - 길이: 2자 이상 20자 이하
    - 형식: 한글, 영문 대소문자, 숫자, 언더바(_)만 허용
    - 정규식: `/^[가-힣a-zA-Z0-9_]+$/`
  - `password`:
    - 길이: 8자 이상 20자 이하
    - 형식: 영문 소문자, 영문 대문자, 숫자, 특수문자를 각각 1개 이상 포함해야 함
    - 정규식: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/`
- **Response Body**:
  ```typescript
  {
    user: {
      picture: string
      userAuth: number
      userId: string
      userMail: string
      userName: string
      userOId: string
    }
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

컴포넌트 마운트 시 자동으로 실행되는 효과:

- **초기 토큰 갱신**: 앱 시작 시 저장된 JWT 토큰으로 사용자 정보 갱신
- **로그인 상태 동기화**: `userOId` 변경 시 `isLoggedIn` 상태 자동 업데이트

## 데이터 흐름

1. **로그인 흐름**:
   ```
   사용자 입력 → logIn() → API 호출 → localStorage 저장 → 상태 업데이트 → isLoggedIn = true
   ```

2. **토큰 갱신 흐름**:
   ```
   앱 시작/refreshToken() 호출 → localStorage에서 토큰 읽기 → API 호출 → 상태 업데이트
   ```

3. **로그아웃 흐름**:
   ```
   logOut() 호출 → localStorage 초기화 → 상태 초기화 → 홈으로 리다이렉트
   ```

## localStorage 저장 항목

다음 항목들이 localStorage에 저장됩니다:

- `jwtFromServer`: JWT 토큰
- `userId`: 사용자 ID
- `userName`: 사용자 이름
- `userMail`: 사용자 이메일
- `userOId`: 사용자 Object ID
- `userAuth`: 사용자 권한 레벨 (문자열)
- `picture`: 프로필 사진 URL

## 권한 레벨

- `AUTH_GUEST` (0): 게스트 (비로그인)
- `AUTH_USER` (1): 일반 사용자
- `AUTH_ADMIN` (100): 관리자

## 주의사항

1. **토큰 갱신**: `refreshToken()`은 비동기 함수이므로 `await`를 사용해야 합니다.
2. **권한 검증**: 권한이 필요한 페이지에서는 `refreshToken()`으로 권한을 확인한 후 접근을 제어하세요.
3. **에러 처리**: API 호출 실패 시 자동으로 에러 알림이 표시됩니다.
4. **Lock 메커니즘**: `logIn`과 `signUp`은 중복 호출을 방지하기 위해 Redux의 lock 상태를 사용합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.auth/`
- 타입 정의: `client/src/base/types/`
- Fetch 유틸리티: `client/src/base/fetch/`
