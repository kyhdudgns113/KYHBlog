# Comment Context

댓글 및 답글 관리를 담당하는 Context입니다.

## 개요

Comment Context는 파일에 대한 댓글 작성, 답글 작성, 댓글/답글 수정 및 삭제 기능을 제공합니다. Redux와 연동하여 댓글 상태를 관리합니다.

## 파일 구조

```
comment/
├── __states.tsx      # 댓글 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 댓글 관련 콜백 함수
├── _effects.tsx     # 댓글 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

댓글 관련 비즈니스 로직을 처리하는 함수들:

#### `addComment(userOId: string, userName: string, fileOId: string, content: string): Promise<APIReturnType>`
- 댓글 작성
- 파일에 새 댓글 추가

**API 정보:**
- **엔드포인트**: `POST /client/file/addComment`
- **Request Body**:
  ```typescript
  {
    userOId: string   // 작성자 Object ID
    userName: string  // 작성자 이름
    fileOId: string   // 파일 Object ID
    content: string   // 댓글 내용 (최대 300자)
  }
  ```
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]  // 업데이트된 댓글 및 답글 배열
  }
  ```

#### `addReply(userOId: string, userName: string, targetUserOId: string, targetUserName: string, commentOId: string, content: string): Promise<APIReturnType>`
- 답글 작성
- 댓글에 대한 답글 추가

**API 정보:**
- **엔드포인트**: `POST /client/file/addReply`
- **Request Body**:
  ```typescript
  {
    userOId: string        // 작성자 Object ID
    userName: string       // 작성자 이름
    targetUserOId: string  // 대상 사용자 Object ID (답글을 받는 사람)
    targetUserName: string // 대상 사용자 이름
    commentOId: string     // 댓글 Object ID
    content: string        // 답글 내용
  }
  ```
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]
  }
  ```

#### `editComment(commentOId: string, newContent: string): Promise<APIReturnType>`
- 댓글 수정

**API 정보:**
- **엔드포인트**: `PUT /client/file/editComment`
- **Request Body**:
  ```typescript
  {
    commentOId: string  // 댓글 Object ID
    newContent: string  // 새 댓글 내용
  }
  ```
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]
  }
  ```

#### `editReply(replyOId: string, newContent: string): Promise<APIReturnType>`
- 답글 수정

**API 정보:**
- **엔드포인트**: `PUT /client/file/editReply`
- **Request Body**:
  ```typescript
  {
    replyOId: string   // 답글 Object ID
    newContent: string // 새 답글 내용
  }
  ```
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]
  }
  ```

#### `deleteComment(commentOId: string): Promise<APIReturnType>`
- 댓글 삭제

**API 정보:**
- **엔드포인트**: `DELETE /client/file/deleteComment/:commentOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]
  }
  ```

#### `deleteReply(replyOId: string): Promise<APIReturnType>`
- 답글 삭제

**API 정보:**
- **엔드포인트**: `DELETE /client/file/deleteReply/:replyOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## 데이터 흐름

1. **댓글 작성 흐름**:
   ```
   addComment() → API 호출 → Redux 상태 업데이트 (commentReplyArr)
   ```

2. **댓글 수정 흐름**:
   ```
   editComment() → API 호출 → Redux 상태 업데이트 (commentReplyArr)
   ```

3. **댓글 삭제 흐름**:
   ```
   deleteComment() → API 호출 → Redux 상태 업데이트 (commentReplyArr)
   ```

## 주의사항

1. **Redux 의존성**: 댓글 상태는 Redux에서 관리됩니다.
2. **댓글 길이 제한**: 댓글 내용은 최대 300자입니다.
3. **권한 체크**: 댓글 수정/삭제는 작성자 본인만 가능합니다.
4. **JWT 토큰**: 모든 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.file/` (댓글 관련)
- Redux 상태: `client/src/manager/redux/`
- File Context: `client/src/manager/contexts/file/`
