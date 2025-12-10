# Chat Context

실시간 채팅 관리를 담당하는 Context입니다.

## 개요

Chat Context는 채팅방 목록 조회, 채팅 메시지 조회, 채팅 전송 등의 기능을 제공합니다. Socket.io를 통해 실시간 메시징을 지원하며 Redux와 연동됩니다.

## 파일 구조

```
chat/
├── __states.tsx      # 채팅 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 채팅 관련 콜백 함수
├── _effects.tsx     # 채팅 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

채팅 관련 비즈니스 로직을 처리하는 함수들:

#### `loadChatRoomArr(userOId: string): Promise<APIReturnType>`
- 사용자의 채팅방 목록 조회
- Redux의 `chatRoomArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/chat/loadChatRoomArr/:userOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    chatRoomArr: ChatRoomType[]  // 채팅방 배열
  }
  ```

#### `loadUserChatRoom(userOId: string, targetUserOId: string): Promise<APIReturnType>`
- 특정 사용자와의 채팅방 정보 조회
- 채팅방이 없으면 생성
- 채팅 메시지는 로드하지 않음 (채팅방 정보만)

**API 정보:**
- **엔드포인트**: `GET /client/chat/loadUserChatRoom/:userOId/:targetUserOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    chatRoom: ChatRoomType  // 채팅방 정보
  }
  ```

#### `loadChatArr(chatRoomOId: string, firstIdx: number): Promise<APIReturnType>`
- 채팅 메시지 목록 조회
- `firstIdx`가 -1이면 최신 메시지부터 로드 (스크롤을 맨 아래로)
- `firstIdx`가 지정되면 해당 인덱스부터 이전 메시지 로드 (무한 스크롤)

**API 정보:**
- **엔드포인트**: `GET /client/chat/loadChatArr/:chatRoomOId/:firstIdx`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    chatArr: ChatType[]  // 채팅 메시지 배열
  }
  ```

#### `submitChat(socket: SocketType, chatRoomOId: string, content: string): void`
- 채팅 메시지 전송
- Socket.io를 통해 실시간으로 메시지 전송
- API 호출 없음 (Socket 이벤트만 사용)

**Socket 이벤트:**
- **이벤트명**: `chat message`
- **Payload**:
  ```typescript
  {
    chatRoomOId: string  // 채팅방 Object ID
    content: string      // 메시지 내용 (최대 1000자)
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

Socket.io를 통한 실시간 채팅 메시지 수신:

- **새 메시지 수신**: `chat message` 이벤트 수신 시 Redux 상태 업데이트
- **채팅방 상태 동기화**: 채팅방 활성화/비활성화 상태 동기화

## 데이터 흐름

1. **채팅방 목록 조회 흐름**:
   ```
   loadChatRoomArr() → API 호출 → Redux 상태 업데이트 (chatRoomArr)
   ```

2. **채팅 메시지 조회 흐름**:
   ```
   loadChatArr() → API 호출 → Redux 상태 업데이트 (chatArr)
   ```

3. **채팅 메시지 전송 흐름**:
   ```
   submitChat() → Socket 이벤트 전송 → 서버 처리 → 다른 사용자에게 실시간 전달
   ```

## 채팅 메시지 길이 제한

- 최대 길이: 1000자 (`CHAT_MAX_LENGTH`)

## 주의사항

1. **Redux 의존성**: 채팅 상태는 Redux에서 관리됩니다.
2. **Socket 연결**: 채팅 전송을 위해서는 Socket Context가 연결되어 있어야 합니다.
3. **무한 스크롤**: `loadChatArr`의 `firstIdx` 파라미터를 사용하여 이전 메시지를 로드할 수 있습니다.
4. **JWT 토큰**: 모든 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.chat/`
- Socket Gateway: `server/src/modules/socket/`
- Redux 상태: `client/src/manager/redux/`
- Socket Context: `client/src/manager/contexts/socket/`
