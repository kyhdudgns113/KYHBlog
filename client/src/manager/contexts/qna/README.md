# QnA Context

Q&A 게시판 관리를 담당하는 Context입니다.

## 개요

QnA Context는 질문 작성, 질문 수정/삭제, Q&A 목록 조회, Q&A 댓글 관리 등의 기능을 제공합니다. Redux와 연동하여 Q&A 상태를 관리합니다.

## 파일 구조

```
qna/
├── __states.tsx      # Q&A 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # Q&A 관련 콜백 함수
├── _effects.tsx     # Q&A 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 Redux에서 관리되며, Context에는 상태가 없습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

Q&A 관련 비즈니스 로직을 처리하는 함수들:

#### `addQnAFile(userOId: string, title: string, content: string, isPrivate: boolean): Promise<APIReturnType>`
- Q&A 질문 작성
- 새 질문 게시

**API 정보:**
- **엔드포인트**: `POST /client/qna/addQnAFile`
- **Request Body**:
  ```typescript
  {
    userOId: string    // 작성자 Object ID
    title: string      // 질문 제목 (최대 32자)
    content: string    // 질문 내용 (최대 1000자)
    isPrivate: boolean // 비공개 여부
  }
  ```
- **Response Body**:
  ```typescript
  {
    qnAOId: string  // 생성된 Q&A Object ID
  }
  ```

#### `addQnAComment(qnAOId: string, userOId: string, userName: string, content: string, targetQCommentOId: string | null): Promise<APIReturnType>`
- Q&A 댓글 작성
- 질문에 대한 댓글 또는 댓글에 대한 답글 추가

**API 정보:**
- **엔드포인트**: `POST /client/qna/addQnAComment`
- **Request Body**:
  ```typescript
  {
    qnAOId: string           // Q&A Object ID
    userOId: string          // 작성자 Object ID
    userName: string         // 작성자 이름
    content: string          // 댓글 내용
    targetQCommentOId: string | null  // 대상 댓글 Object ID (답글인 경우)
  }
  ```
- **Response Body**:
  ```typescript
  {
    qnACommentArr: QnACommentType[]  // 업데이트된 댓글 배열
  }
  ```

#### `loadQnA(qnAOId: string): Promise<APIReturnType>`
- 특정 Q&A 조회
- 질문 상세 정보 로드

**API 정보:**
- **엔드포인트**: `GET /client/qna/loadQnA/:qnAOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요 (비공개 질문의 경우)
- **Response Body**:
  ```typescript
  {
    qnA: QnAType  // Q&A 정보
  }
  ```

#### `loadQnACommentArr(qnAOId: string): Promise<APIReturnType>`
- Q&A 댓글 목록 조회

**API 정보:**
- **엔드포인트**: `GET /client/qna/loadQnACommentArr/:qnAOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    qnACommentArr: QnACommentType[]  // 댓글 배열
  }
  ```

#### `loadQnARowArr(): Promise<APIReturnType>`
- Q&A 목록 조회
- 전체 Q&A 목록 로드

**API 정보:**
- **엔드포인트**: `GET /client/qna/loadQnARowArr`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    qnARowArr: QnARowType[]  // Q&A 행 배열
  }
  ```

#### `modifyQnA(qnAOId: string, title: string, content: string, isPrivate: boolean): Promise<APIReturnType>`
- Q&A 질문 수정

**API 정보:**
- **엔드포인트**: `PUT /client/qna/modifyQnA`
- **Request Body**:
  ```typescript
  {
    qnAOId: string     // Q&A Object ID
    title?: string      // 새 제목 (선택사항)
    content?: string    // 새 내용 (선택사항)
    isPrivate?: boolean // 새 비공개 여부 (선택사항)
  }
  ```
- **Response Body**:
  ```typescript
  {
    qnA: QnAType
  }
  ```

#### `deleteQnA(qnAOId: string): Promise<APIReturnType>`
- Q&A 질문 삭제

**API 정보:**
- **엔드포인트**: `DELETE /client/qna/deleteQnA/:qnAOId`
- **Request**: 
  - **Body**: 없음
  - **Header**: JWT 토큰 필요
- **Response Body**:
  ```typescript
  {
    // 빈 객체
  }
  ```

### 3. 사이드 이펙트 (`_effects.tsx`)

현재 사이드 이펙트는 없습니다.

## 데이터 흐름

1. **Q&A 작성 흐름**:
   ```
   addQnAFile() → API 호출 → qnAOId 반환
   ```

2. **Q&A 조회 흐름**:
   ```
   loadQnA() → API 호출 → Redux 상태 업데이트 (qnA)
   ```

3. **Q&A 목록 조회 흐름**:
   ```
   loadQnARowArr() → API 호출 → Redux 상태 업데이트 (qnARowArr)
   ```

## 제한사항

- **제목 길이**: 최대 32자
- **내용 길이**: 최대 1000자
- **비공개 질문**: 작성자와 관리자만 조회 가능

## 주의사항

1. **Redux 의존성**: Q&A 상태는 Redux에서 관리됩니다.
2. **권한 체크**: Q&A 수정/삭제는 작성자 본인만 가능합니다.
3. **비공개 질문**: `isPrivate: true`인 경우 JWT 토큰으로 권한을 확인합니다.
4. **JWT 토큰**: 대부분의 API는 JWT 토큰이 필요합니다.

## 관련 파일

- API 엔드포인트: `server/src/modules/client/client.qna/`
- Redux 상태: `client/src/manager/redux/`
