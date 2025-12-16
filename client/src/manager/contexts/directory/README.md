# Directory Context

디렉토리 및 파일 구조 관리를 담당하는 Context입니다.

## 개요

Directory Context는 디렉토리 생성, 파일 생성, 디렉토리/파일 이동, 이름 변경, 삭제 등의 기능을 제공합니다. 계층적 디렉토리 구조를 관리하며 Redux와 연동됩니다.

## 파일 구조

```
directory/
├── __states.tsx      # 디렉토리 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # 디렉토리 관련 콜백 함수
├── _effects.tsx     # 디렉토리 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

디렉토리 관련 비즈니스 로직을 처리하는 함수들:

#### `addDirectory(parentDirOId: string, dirName: string): Promise<APIReturnType>`
- 새 디렉토리 생성
- 부모 디렉토리 내에 새 폴더 생성

**API 정보:**
- **엔드포인트**: `POST /client/directory/addDirectory`
- **Request Body**:
  ```typescript
  {
    parentDirOId: string  // 부모 디렉토리 Object ID (null 불가)
    dirName: string      // 디렉토리 이름 (최대 20자)
  }
  ```
- **Request Body 검증**:
  - `dirName`: 공백 제거 후 길이 체크, 최대 32자
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]    // 추가/수정된 디렉토리 배열
    extraFileRows: FileRowType[]   // 추가/수정된 파일 행 배열
  }
  ```

#### `addFile(dirOId: string, fileName: string): Promise<APIReturnType>`
- 새 파일 생성
- 지정된 디렉토리 내에 새 파일 생성

**API 정보:**
- **엔드포인트**: `POST /client/directory/addFile`
- **Request Body**:
  ```typescript
  {
    dirOId: string    // 디렉토리 Object ID
    fileName: string  // 파일명 (최대 40자)
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `loadDirectory(dirOId: string): Promise<APIReturnType>`
- 특정 디렉토리 조회
- 디렉토리 구조 및 파일 목록 로드

**API 정보:**
- **엔드포인트**: `GET /client/directory/loadDirectory/:dirOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    directories: DirectoryType[]  // 디렉토리 배열
    fileRows: FileRowType[]       // 파일 행 배열
  }
  ```

#### `loadRootDirectory(): Promise<APIReturnType>`
- 루트 디렉토리 조회
- 최상위 디렉토리 구조 로드

**API 정보:**
- **엔드포인트**: `GET /client/directory/loadRootDirectory`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    rootDirOId: string          // 루트 디렉토리 Object ID
    directories: DirectoryType[]
    fileRows: FileRowType[]
  }
  ```

#### `changeDirName(dirOId: string, dirName: string): Promise<APIReturnType>`
- 디렉토리 이름 변경

**API 정보:**
- **엔드포인트**: `PUT /client/directory/changeDirName`
- **Request Body**:
  ```typescript
  {
    dirOId: string   // 디렉토리 Object ID
    dirName: string  // 새 디렉토리 이름
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `changeFileName(fileOId: string, fileName: string): Promise<APIReturnType>`
- 파일명 변경

**API 정보:**
- **엔드포인트**: `PUT /client/directory/changeFileName`
- **Request Body**:
  ```typescript
  {
    fileOId: string  // 파일 Object ID
    fileName: string // 새 파일명
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `moveDirectory(parentDirOId: string, moveDirOId: string, dirIdx: number | null): Promise<APIReturnType>`
- 디렉토리 이동
- 다른 디렉토리로 이동하거나 같은 디렉토리 내에서 순서 변경

**API 정보:**
- **엔드포인트**: `PUT /client/directory/moveDirectory`
- **Request Body**:
  ```typescript
  {
    moveDirOId: string           // 이동할 디렉토리 Object ID
    oldParentDirOId: string      // 기존 부모 디렉토리 Object ID
    oldParentChildArr: string[]  // 기존 부모의 자식 디렉토리 OId 배열
    newParentDirOId: string      // 새 부모 디렉토리 Object ID
    newParentChildArr: string[]  // 새 부모의 자식 디렉토리 OId 배열
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `moveFile(dirOId: string, moveFileOId: string, fileIdx: number | null): Promise<APIReturnType>`
- 파일 이동
- 다른 디렉토리로 이동하거나 같은 디렉토리 내에서 순서 변경

**API 정보:**
- **엔드포인트**: `PUT /client/directory/moveFile`
- **Request Body**:
  ```typescript
  {
    moveFileOId: string          // 이동할 파일 Object ID
    oldParentDirOId: string      // 기존 부모 디렉토리 Object ID
    oldParentChildArr: string[]  // 기존 부모의 자식 파일 OId 배열
    newParentDirOId: string      // 새 부모 디렉토리 Object ID
    newParentChildArr: string[]  // 새 부모의 자식 파일 OId 배열
  }
  ```
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `deleteDir(dirOId: string): Promise<APIReturnType>`
- 디렉토리 삭제
- 빈 디렉토리만 삭제 가능

**API 정보:**
- **엔드포인트**: `DELETE /client/directory/deleteDir/:dirOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

#### `deleteFile(fileOId: string): Promise<APIReturnType>`
- 파일 삭제

**API 정보:**
- **엔드포인트**: `DELETE /client/directory/deleteFile/:fileOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    extraDirs: DirectoryType[]
    extraFileRows: FileRowType[]
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## 데이터 흐름

1. **디렉토리 로드 흐름**:
   ```
   loadDirectory() → API 호출 → Redux 상태 업데이트 (directories, fileRows)
   ```

2. **디렉토리 생성 흐름**:
   ```
   addDirectory() → API 호출 → Redux 상태 업데이트 (extraDirs, extraFileRows)
   ```

3. **파일 이동 흐름**:
   ```
   moveFile() → 기존/새 부모 정보 수집 → API 호출 → Redux 상태 업데이트
   ```

## 주의사항

1. **Redux 의존성**: 디렉토리 및 파일 구조는 Redux에서 관리됩니다.
2. **이동 작업**: `moveDirectory`와 `moveFile`은 기존/새 부모의 자식 배열 정보가 필요합니다.
3. **디렉토리 삭제**: 빈 디렉토리만 삭제 가능합니다.
4. **JWT 토큰**: 모든 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.directory/`
- Redux 상태: `client/src/manager/redux/`
- File Context: `client/src/manager/contexts/file/`
