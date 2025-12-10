# Admin Context

관리자 기능을 담당하는 Context입니다.

## 개요

Admin Context는 관리자 전용 기능인 로그 조회 및 사용자 목록 조회를 제공합니다. 관리자 권한이 필요한 API를 호출합니다.

## 파일 구조

```
admin/
├── __states.tsx      # 관리자 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 관리자 관련 콜백 함수
├── _effects.tsx     # 관리자 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

관리자 관련 비즈니스 로직을 처리하는 함수들:

#### `loadLogArr(isAlert: boolean): Promise<APIReturnType>`
- 시스템 로그 목록 조회
- 관리자 전용 기능
- Redux의 `logArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/admin/loadLogArr`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요 (관리자 권한 필요)
- **Response Body**:
  ```typescript
  {
    logArr: LogType[]  // 로그 배열
  }
  ```

#### `loadUserArr(isAlert: boolean): Promise<APIReturnType>`
- 전체 사용자 목록 조회
- 관리자 전용 기능
- Redux의 `userArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/admin/loadUserArr`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요 (관리자 권한 필요)
- **Response Body**:
  ```typescript
  {
    userArr: UserType[]  // 사용자 배열
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## 데이터 흐름

1. **로그 조회 흐름**:
   ```
   loadLogArr() → API 호출 (관리자 권한 체크) → Redux 상태 업데이트 (logArr)
   ```

2. **사용자 목록 조회 흐름**:
   ```
   loadUserArr() → API 호출 (관리자 권한 체크) → Redux 상태 업데이트 (userArr)
   ```

## 주의사항

1. **관리자 권한 필수**: 모든 API는 관리자 권한(`AUTH_ADMIN`)이 필요합니다.
2. **에러 알림 제어**: `isAlert` 파라미터로 에러 발생 시 알림 표시 여부를 제어할 수 있습니다.
3. **Redux 의존성**: 로그 및 사용자 상태는 Redux에서 관리됩니다.
4. **JWT 토큰**: 모든 API는 JWT 토큰이 필요하며, 관리자 권한이 포함되어 있어야 합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.admin/`
- Guard: `server/src/common/guards/guards.checkAdmin.ts`
- Redux 상태: `client/src/manager/redux/`
