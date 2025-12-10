# Socket Context

Socket.io 연결 및 이벤트 관리를 담당하는 Context입니다.

## 개요

Socket Context는 Socket.io 클라이언트 연결, 이벤트 수신/전송, 연결 해제 등의 기능을 제공합니다. 실시간 통신의 기반이 되는 Context입니다.

## 파일 구조

```
socket/
├── __states.tsx      # Socket 상태 관리
├── _callbacks.tsx    # Socket 관련 콜백 함수
├── _effects.tsx     # Socket 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

Socket 연결 상태를 관리합니다:

- `socket`: Socket.io 클라이언트 인스턴스
- `setSocket`: Socket 인스턴스 설정 함수

### 2. 콜백 함수 (`_callbacks.tsx`)

Socket 관련 비즈니스 로직을 처리하는 함수들:

#### `connectSocket(socket: SocketType, userOId: string, setter: Setter<boolean>): Promise<void>`
- Socket.io 서버에 연결
- JWT 토큰을 사용한 인증 처리
- 연결 성공 시 `setter(true)` 호출

**연결 과정:**
1. Socket.io 클라이언트 생성 (`io(serverUrl)`)
2. `request validation` 이벤트 전송 (JWT 토큰 포함)
3. 서버에서 `response validation` 이벤트 수신
4. `user connect` 이벤트 전송 (인증 완료)

#### `disconnectSocket(socket: SocketType): void`
- Socket.io 연결 해제
- Socket 인스턴스를 null로 설정

#### `onSocket(socket: SocketType, event: string, callback: (payload: any) => void): void`
- Socket 이벤트 리스너 등록
- 특정 이벤트를 수신할 때 콜백 함수 실행

#### `offSocket(socket: SocketType, event: string): void`
- Socket 이벤트 리스너 제거
- 특정 이벤트의 모든 리스너 제거

#### `emitSocket(socket: SocketType, event: string, payload: any): void`
- Socket 이벤트 전송
- 서버로 이벤트와 데이터 전송

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## Socket 이벤트

### 클라이언트 → 서버 이벤트

- `request validation`: Socket 연결 시 JWT 토큰 검증 요청
- `user connect`: 사용자 연결 알림
- `chat message`: 채팅 메시지 전송

### 서버 → 클라이언트 이벤트

- `response validation`: JWT 토큰 검증 응답
- `chat message`: 채팅 메시지 수신
- `new alarm`: 새 알림 수신
- `remove alarm`: 알림 삭제 알림

## 데이터 흐름

1. **Socket 연결 흐름**:
   ```
   connectSocket() → Socket 생성 → JWT 검증 요청 → 검증 응답 → 사용자 연결 알림
   ```

2. **이벤트 수신 흐름**:
   ```
   서버 이벤트 발생 → onSocket 리스너 실행 → 콜백 함수 처리
   ```

3. **이벤트 전송 흐름**:
   ```
   emitSocket() → Socket 이벤트 전송 → 서버 처리
   ```

## JWT 토큰 인증

Socket 연결 시 JWT 토큰을 사용하여 인증합니다:

1. localStorage에서 `jwtFromServer` 읽기
2. JWT를 header와 body로 분리
3. `request validation` 이벤트로 전송
4. 서버 검증 후 `response validation` 응답
5. `user connect` 이벤트로 최종 연결

## 주의사항

1. **JWT 토큰 필요**: Socket 연결을 위해서는 localStorage에 `jwtFromServer`가 있어야 합니다.
2. **이벤트 리스너 관리**: 컴포넌트 언마운트 시 `offSocket`으로 리스너를 제거해야 메모리 누수를 방지할 수 있습니다.
3. **연결 상태 확인**: `socket`이 null이 아닌지 확인한 후 이벤트를 전송하세요.
4. **에러 처리**: 연결 실패 시 `alert`로 사용자에게 알림이 표시됩니다.

## 관련 파일

- Socket Gateway: `server/src/modules/socket/`
- Secret 설정: `client/src/base/secret/`
- Chat Context: `client/src/manager/contexts/chat/`
- User Context: `client/src/manager/contexts/user/`
