# User Context

사용자 정보 및 알림 관리를 담당하는 Context입니다.

## 개요

User Context는 사용자 정보 조회, 알림 목록 관리, 알림 읽음 처리 등의 기능을 제공합니다. Socket.io를 통해 실시간 알림을 수신합니다.

## 파일 구조

```
user/
├── __states.tsx      # 사용자 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 사용자 관련 콜백 함수
├── _effects.tsx     # 사용자 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

사용자 관련 비즈니스 로직을 처리하는 함수들:

#### `checkNewAlarm(alarmArr: AlarmTypeLocal[]): Promise<APIReturnType>`
- 새 알림을 읽음 처리
- `alarmStatus`가 `ALARM_STATUS_NEW`인 알림만 필터링하여 전송

**API 정보:**
- **엔드포인트**: `PUT /client/user/checkNewAlarm`
- **Request Body**:
  ```typescript
  {
    checkedAlarmArr: AlarmType[]  // 읽음 처리할 알림 배열
  }
  ```
- **Response Body**:
  ```typescript
  {
    alarmArr?: AlarmType[]  // 업데이트된 알림 배열 (선택사항)
  }
  ```

#### `loadAlarmArr(userOId: string): Promise<APIReturnType>`
- 사용자의 알림 목록 조회
- Redux의 `alarmArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/user/loadAlarmArr/:userOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    alarmArr: AlarmType[]  // 알림 배열
  }
  ```

#### `loadUserInfo(userOId: string, setTargetUser: Setter<UserTypeLocal>): Promise<APIReturnType>`
- 특정 사용자 정보 조회
- JWT 토큰 없이도 접근 가능 (공개 정보)

**API 정보:**
- **엔드포인트**: `GET /client/user/loadUserInfo/:userOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 불필요
- **Response Body**:
  ```typescript
  {
    user: UserTypeLocal  // 사용자 정보
  }
  ```

#### `removeAlarm(alarmOId: string): Promise<APIReturnType>`
- 알림 삭제
- Redux의 `alarmArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `DELETE /client/user/removeAlarm/:alarmOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    alarmArr: AlarmType[]  // 업데이트된 알림 배열
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

컴포넌트 마운트 시 자동으로 실행되는 효과:

- **초기 알림 로드**: 사용자 로그인 시 (`userOId` 변경 시) 알림 목록 자동 로드
- **실시간 알림 수신**: Socket.io를 통해 새 알림 수신 시 Redux 상태 업데이트
  - `new alarm` 이벤트: 새 알림이 오면 배열 앞에 추가
  - `remove alarm` 이벤트: 알림 삭제 시 Redux 상태에서 제거

## 데이터 흐름

1. **알림 조회 흐름**:
   ```
   loadAlarmArr() → API 호출 → Redux 상태 업데이트
   ```

2. **알림 읽음 처리 흐름**:
   ```
   checkNewAlarm() → 새 알림 필터링 → API 호출 → Redux 상태 업데이트
   ```

3. **실시간 알림 수신 흐름**:
   ```
   Socket 이벤트 수신 → Redux 상태 업데이트 (pushFrontAlarmArr)
   ```

## 알림 타입

알림은 다음 타입들이 있습니다:

- `ALARM_TYPE_FILE_COMMENT` (0): 파일 댓글 알림
- `ALARM_TYPE_COMMENT_REPLY` (1): 댓글 답글 알림
- `ALARM_TYPE_TAG_REPLY` (2): 태그 답글 알림
- `ALARM_TYPE_QNA_NEW` (3): Q&A 새 질문 알림
- `ALARM_TYPE_QNA_COMMENT` (4): Q&A 댓글 알림

## 알림 상태

- `ALARM_STATUS_NEW` (0): 읽지 않은 알림
- `ALARM_STATUS_OLD` (1): 읽은 알림

## 주의사항

1. **Redux 의존성**: 알림 상태는 Redux에서 관리되므로 `useAlarmActions`를 통해 접근합니다.
2. **Socket 연결**: 실시간 알림 수신을 위해서는 Socket Context가 설정되어 있어야 합니다.
3. **JWT 토큰**: `loadUserInfo`는 공개 정보이므로 JWT 토큰이 필요 없지만, 나머지 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.user/`
- Redux 상태: `client/src/manager/redux/`
- Socket 이벤트: `client/src/manager/contexts/socket/`
- 타입 정의: `client/src/base/types/`
