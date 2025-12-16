# File Context

파일 관리 및 댓글 조회를 담당하는 Context입니다.

## 개요

File Context는 파일 조회, 파일 수정, 파일 상태 변경, 댓글 목록 조회 등의 기능을 제공합니다. Redux와 연동하여 디렉토리 및 파일 상태를 관리합니다.

## 파일 구조

```
file/
├── __states.tsx      # 파일 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 파일 관련 콜백 함수
├── _effects.tsx     # 파일 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

파일 관련 비즈니스 로직을 처리하는 함수들:

#### `loadFile(fileOId: string): Promise<APIReturnType>`
- 특정 파일 조회
- Redux의 `file`, `fileOId`, `fileUser` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/file/loadFile/:fileOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    file: FileType
    fileUser: UserType
  }
  ```

#### `loadNoticeFile(): Promise<APIReturnType>`
- 공지사항 파일 조회
- Redux의 `file`, `fileOId`, `fileUser` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/file/loadNoticeFile`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    file: FileType
    fileUser: UserType
  }
  ```

#### `loadComments(fileOId: string): Promise<APIReturnType>`
- 파일의 댓글 목록 조회
- Redux의 `commentReplyArr` 상태 업데이트

**API 정보:**
- **엔드포인트**: `GET /client/file/loadComments/:fileOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    commentReplyArr: CommentReplyType[]  // 댓글 및 답글 배열
  }
  ```

#### `editFile(fileOId: string, fileName: string, content: string): Promise<APIReturnType>`
- 파일 내용 수정
- 파일명과 내용을 수정하며, 디렉토리 구조도 함께 업데이트

**API 정보:**
- **엔드포인트**: `PUT /client/file/editFile`
- **Request Body**:
  ```typescript
  {
    fileOId: string    // 파일 Object ID
    fileName: string   // 새 파일명
    content: string   // 새 파일 내용
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]    // 추가/수정된 디렉토리 배열
    extraFileRows: FileRowType[]   // 추가/수정된 파일 행 배열
  }
  ```

#### `editFileStatus(fileOId: string, newFileStatus: number): Promise<APIReturnType>`
- 파일 상태 변경
- 파일 상태를 변경하며 (일반/숨김/공지), 디렉토리 구조도 함께 업데이트

**API 정보:**
- **엔드포인트**: `PUT /client/file/editFileStatus`
- **Request Body**:
  ```typescript
  {
    fileOId: string      // 파일 Object ID
    newFileStatus: number // 새 파일 상태 (0: 일반, 1: 숨김, 2: 공지)
  }
  ```
- **Response Body**:
  ```typescript
  {
    file: FileType
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## 데이터 흐름

1. **파일 조회 흐름**:
   ```
   loadFile() → API 호출 → Redux 상태 업데이트 (file, fileOId, fileUser)
   ```

2. **파일 수정 흐름**:
   ```
   editFile() → API 호출 → Redux 상태 업데이트 (extraDirs, extraFileRows)
   ```

3. **댓글 조회 흐름**:
   ```
   loadComments() → API 호출 → Redux 상태 업데이트 (commentReplyArr)
   ```

## 파일 상태

- `FILE_NORMAL` (0): 일반 파일
- `FILE_HIDDEN` (1): 숨김 파일
- `FILE_NOTICE` (2): 공지 파일

## 주의사항

1. **Redux 의존성**: 파일 및 디렉토리 상태는 Redux에서 관리됩니다.
2. **디렉토리 업데이트**: 파일 수정/상태 변경 시 `extraDirs`와 `extraFileRows`가 반환되어 디렉토리 구조가 자동으로 업데이트됩니다.
3. **JWT 토큰**: 모든 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.file/`
- Redux 상태: `client/src/manager/redux/`
- Comment Context: `client/src/manager/contexts/comment/`
- Directory Context: `client/src/manager/contexts/directory/`
