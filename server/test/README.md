# 테스트 모듈 가이드

KYHBlog 백엔드 서버의 테스트 시스템에 대한 상세 가이드입니다.

## 목차

- [개요](#개요)
- [테스트 구조](#테스트-구조)
- [테스트 실행](#테스트-실행)
- [테스트 작성 가이드](#테스트-작성-가이드)
- [테스트 유틸리티](#테스트-유틸리티)
- [모범 사례](#모범-사례)

## 개요

이 프로젝트는 커스텀 테스트 프레임워크를 사용하여 모듈화되고 구조화된 테스트를 작성합니다. 테스트는 `GKDTestBase` 클래스를 상속받아 작성되며, 자동화된 데이터베이스 초기화 및 정리 기능을 제공합니다.

### 주요 특징

- **모듈화된 테스트 구조**: 각 기능별로 독립적인 테스트 모듈로 구성
- **자동 DB 관리**: 테스트 실행 시 자동으로 테스트 DB 초기화 및 정리
- **로그 레벨 제어**: 테스트 실행 시 상세 로그 출력 레벨을 조절할 수 있음
- **에러 검증**: 정상 동작(`testOK`)과 에러 케이스(`testFail`) 모두 테스트 가능

## 테스트 구조

```
test/
├── _common/                    # 공통 테스트 유틸리티
│   ├── gkd.test.baseClass.ts  # 테스트 베이스 클래스
│   ├── gkd.test.db.ts         # 테스트 DB 관리 클래스
│   ├── testValues.ts          # 테스트용 상수 값
│   └── _testExample/          # 테스트 작성 예제
│
├── client/                     # 클라이언트 API 테스트
│   ├── client.auth/           # 인증 관련 테스트
│   ├── client.chat/           # 채팅 관련 테스트
│   ├── client.directory/      # 디렉토리 관련 테스트
│   └── client.file/           # 파일 관련 테스트
│
└── gkd.test.ts                # 메인 테스트 실행 파일
```

## 테스트 실행

### 기본 실행

```bash
# 전체 테스트 실행
npm run gkd

# 커버리지 포함 실행
npm run gkd:cov
```

### 로그 레벨별 실행

테스트 실행 시 로그 출력 레벨을 조절할 수 있습니다:

```bash
npm run gkd1   # 로그 레벨 1
npm run gkd2   # 로그 레벨 2
npm run gkd3   # 로그 레벨 3
...
npm run gkd10  # 로그 레벨 10
```

로그 레벨이 높을수록 더 상세한 로그가 출력됩니다.

### Jest 테스트 실행

Jest를 사용한 단위 테스트도 함께 사용할 수 있습니다:

```bash
# 단위 테스트 실행
npm test

# 커버리지 포함
npm run test:cov

# E2E 테스트
npm run test:e2e
```

## 테스트 작성 가이드

### 기본 구조

모든 테스트 클래스는 `GKDTestBase`를 상속받아 작성합니다:

```typescript
import {GKDTestBase} from '@testCommon'
import * as mysql from 'mysql2/promise'

export class MyTestModule extends GKDTestBase {
  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // 테스트 전 초기화 작업
  }

  protected async execTest(db: mysql.Pool, logLevel: number) {
    // 실제 테스트 로직
  }

  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // 테스트 후 정리 작업
  }
}
```

### 테스트 메서드

#### `testOK` / `testFail`: 외부 클래스 테스트

다른 테스트 클래스 인스턴스를 테스트할 때 사용합니다:

```typescript
export class MyTestModule extends GKDTestBase {
  private readonly someModule: SomeTestModule

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
    this.someModule = new SomeTestModule(REQUIRED_LOG_LEVEL + 1)
  }

  protected async execTest(db: mysql.Pool, logLevel: number) {
    // 외부 테스트 클래스의 정상 동작 테스트
    await this.someModule.testOK(db, logLevel)
    
    // 외부 테스트 클래스의 에러 케이스 테스트
    await this.someModule.testFail(db, logLevel)
  }
}
```

**`testFail`의 동작 방식**:
- 테스트 클래스의 `execTest`가 예상된 에러(`gkdErrCode` 포함)를 throw하면 → 정상 처리
- 테스트 클래스의 `execTest`가 정상 종료되면 → `testFail`이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
- 테스트 클래스의 `execTest`가 예상되지 않은 에러를 throw하면 → `testFail`이 "예기치 못한 에러 발생"이라고 판단하여 에러를 throw

#### `memberOK` / `memberFail`: 내부 메서드 테스트

현재 클래스 내부에 선언된 메서드를 테스트할 때 사용합니다:

```typescript
export class MyTestModule extends GKDTestBase {
  protected async execTest(db: mysql.Pool, logLevel: number) {
    // 내부 메서드의 정상 동작 테스트
    await this.memberOK(this.testSomeFunction.bind(this), db, logLevel)
    
    // 내부 메서드의 에러 케이스 테스트
    await this.memberFail(this.testErrorCase.bind(this), db, logLevel)
  }

  // 테스트할 내부 메서드
  private async testSomeFunction(db: mysql.Pool, logLevel: number) {
    // 테스트 로직
  }

  private async testErrorCase(db: mysql.Pool, logLevel: number) {
    try {
      // 서비스 코드 호출 (에러가 발생할 수 있음)
      await someService.someMethod()
    } catch (errObj) {
      // 예상된 에러인 경우에만 throw
      if (errObj.gkdErrCode === 'EXPECTED_ERROR_CODE') {
        throw errObj  // 예상된 에러를 throw → memberFail이 정상 처리
      }
      // 예상되지 않은 에러인 경우 에러를 throw하지 않고 정상 종료
      // → memberFail이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
      return
    }
    // 에러가 발생하지 않은 경우도 정상 종료
    // → memberFail이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
  }
}
```

**`memberFail`의 동작 방식**:
- 테스트 메서드가 예상된 에러(`gkdErrCode` 포함)를 throw하면 → 정상 처리
- 테스트 메서드가 정상 종료되면 → `memberFail`이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
- 테스트 메서드가 예상되지 않은 에러를 throw하면 → `memberFail`이 "예기치 못한 에러 발생"이라고 판단하여 에러를 throw

**주의**: 
- `memberOK`와 `memberFail`을 사용할 때는 반드시 `callback.bind(this)`를 사용해야 합니다. 그래야 `this` 컨텍스트를 올바르게 사용할 수 있습니다.
- `testFail`이나 `memberFail`로 테스트할 때, 예상되지 않은 에러가 발생하거나 에러가 발생하지 않으면, 테스트 대상 클래스나 메서드에서 에러를 throw하지 않고 정상 종료해야 합니다. 그러면 `testFail`이나 `memberFail`이 자동으로 에러를 감지하여 throw합니다.

### 로그 출력

테스트 중 로그를 출력하려면 `logMessage` 메서드를 사용합니다:

```typescript
protected async execTest(db: mysql.Pool, logLevel: number) {
  this.logMessage('테스트 시작', 0)  // 현재 레벨
  this.logMessage('하위 테스트', 1)  // 한 단계 깊은 레벨
}
```

### 에러 처리

테스트에서 예상된 에러를 발생시키려면 `gkdErrCode`가 포함된 에러 객체를 throw합니다:

```typescript
if (someCondition) {
  throw {
    gkdErrCode: 'SOME_ERROR_CODE',
    message: '에러 메시지'
  }
}
```

## 테스트 유틸리티

### TestDB 클래스

테스트용 데이터베이스 관리를 위한 유틸리티 클래스입니다.

#### 사용자 관련

```typescript
const testDB = new TestDB()

// 테스트용 사용자 정보 가져오기
const {user} = testDB.getUserCommon(AUTH_USER, 0)  // 일반 사용자
const {user} = testDB.getUserCommon(AUTH_ADMIN)    // 관리자
const {user} = testDB.getUserCommon(AUTH_GUEST)    // 게스트

// JWT Payload 생성
const {jwtPayload} = testDB.getJwtPayload(AUTH_USER, 0)
```

#### 디렉토리 관련

```typescript
// 디렉토리 생성 (전체 로직 포함)
const {directory} = await testDB.createDirectoryFull(parentDirOId, dirName)

// 디렉토리 생성 (경량 버전, 부모 폴더 수정 없음)
const {directory} = await testDB.createDirectoryLight(parentDirOId, dirOId, dirName)

// 디렉토리 삭제
await testDB.deleteDirectoryFull(dirOId)
await testDB.deleteDirectoryLight(dirOId)
```

#### 파일 관련

```typescript
// 파일 생성
const {file} = await testDB.createFileFull(dirOId, fileName)
const {file} = await testDB.createFileLight(dirOId, fileOId, fileName)

// 파일 삭제
await testDB.deleteFileFull(fileOId)
await testDB.deleteFileLight(fileOId)
```

#### 댓글/답글 관련

```typescript
// 댓글 생성
const {comment} = await testDB.createComment(fileOId, userOId, commentOId, content)

// 답글 생성
const {reply} = await testDB.createReply(commentOId, replyOId, content, fileOId, targetUserOId, userOId)

// 삭제
await testDB.deleteComment(commentOId)
await testDB.deleteReply(replyOId)
```

#### DB 초기화 및 롤백

```typescript
// 테스트 DB 초기화 (자동 호출됨)
await testDB.initTestDB(db)

// 특정 데이터 롤백
import {RESET_FLAG_USER, RESET_FLAG_DIR, RESET_FLAG_FILE, RESET_FLAG_CHAT_ROOM} from '@testValue'
await testDB.resetBaseDB(
  RESET_FLAG_USER | RESET_FLAG_DIR | RESET_FLAG_FILE
)

// DB 정리 (자동 호출됨)
await testDB.cleanUpDB()
```

### 테스트 값 상수

`test/_common/testValues.ts`에서 테스트에 사용할 상수 값들을 정의합니다:

- 사용자 OId: `userOId_root`, `userOId_user_0`, `userOId_user_1`, `userOId_banned`
- 디렉토리 OId: `dirOId_root`, `dirOId_0`, `dirOId_1`
- 파일 OId: `fileOId_root`, `fileOId_0`, `fileOId_1`
- 채팅방 OId: `chatRoomOId_root_0`, `chatRoomOId_root_1` 등

## 모범 사례

### 1. 모듈화된 테스트 구조

각 기능별로 독립적인 테스트 모듈을 만들어 관리합니다:

```
client.file/
├── get/
│   ├── LoadFile/
│   │   ├── LoadFile.test.ts
│   │   ├── CheckAuth/
│   │   ├── WorkingScenario/
│   │   └── WrongInput/
│   └── LoadComments/
└── post/
    └── AddComment/
```

### 2. 테스트 케이스 분류

각 엔드포인트 테스트는 다음 구조로 분류합니다:

- **CheckAuth**: 인증/인가 검증 테스트
- **WorkingScenario**: 정상 동작 시나리오 테스트
- **WrongInput**: 잘못된 입력값 테스트

### 3. 로그 레벨 관리

테스트 클래스의 깊이에 따라 로그 레벨을 조절합니다:

```typescript
const DEFAULT_REQUIRED_LOG_LEVEL = 0  // 최상위 모듈
const DEFAULT_REQUIRED_LOG_LEVEL = 1  // 하위 모듈
const DEFAULT_REQUIRED_LOG_LEVEL = 2  // 더 하위 모듈
```

### 4. DB 상태 관리

테스트 전후로 DB 상태를 올바르게 관리합니다:

```typescript
protected async beforeTest(db: mysql.Pool, logLevel: number) {
  // 필요한 테스트 데이터 생성
}

protected async finishTest(db: mysql.Pool, logLevel: number) {
  // 테스트 데이터 정리 또는 롤백
  await this.testDB.resetBaseDB(RESET_FLAG_USER | RESET_FLAG_DIR)
}
```

### 5. 에러 검증

예상된 에러는 `gkdErrCode`를 포함하여 throw하고, `testFail` 또는 `memberFail`로 검증합니다:

```typescript
// 서비스 코드에서
if (invalidCondition) {
  throw {
    gkdErrCode: 'INVALID_INPUT',
    message: '잘못된 입력입니다'
  }
}

// 외부 클래스 테스트인 경우
export class SomeTestModule extends GKDTestBase {
  protected async execTest(db: mysql.Pool, logLevel: number) {
    // 예상된 에러를 throw해야 함
    throw {
      gkdErrCode: 'INVALID_INPUT',
      message: '잘못된 입력입니다'
    }
  }
}

// 다른 클래스에서 testFail로 테스트
protected async execTest(db: mysql.Pool, logLevel: number) {
  await this.someModule.testFail(db, logLevel)
}

// 내부 메서드 테스트인 경우
protected async execTest(db: mysql.Pool, logLevel: number) {
  await this.memberFail(this.testInvalidInput.bind(this), db, logLevel)
}

private async testInvalidInput(db: mysql.Pool, logLevel: number) {
  try {
    // 서비스 코드 호출
    await someService.someMethod()
  } catch (errObj) {
    // 예상된 에러인 경우에만 throw
    if (errObj.gkdErrCode === 'INVALID_INPUT') {
      throw errObj  // 예상된 에러 → memberFail이 정상 처리
    }
    // 예상되지 않은 에러인 경우 에러를 throw하지 않고 정상 종료
    // → memberFail이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
    return
  }
  // 에러가 발생하지 않은 경우도 정상 종료
  // → memberFail이 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw
}
```

**핵심 포인트**:
- `testFail`이나 `memberFail`로 테스트할 때, 테스트 대상은 예상된 에러(`gkdErrCode` 포함)만 throw해야 합니다.
- 예상되지 않은 에러가 발생하거나 에러가 발생하지 않으면, 에러를 throw하지 않고 정상 종료합니다.
- 그러면 `testFail`이나 `memberFail`이 자동으로 "에러가 발생해야 하는데 발생하지 않았다"고 판단하여 에러를 throw합니다.

## 예제

테스트 작성 예제는 `test/_common/_testExample/` 폴더를 참고하세요.

```bash
# 예제 테스트 실행
ts-node -r tsconfig-paths/register ./test/_common/_testExample/base.test.ts --LOG_LEVEL=7
```

## 문제 해결

### 테스트 DB 연결 오류

테스트 실행 전에 `KYHBlogTest` 데이터베이스가 생성되어 있어야 합니다:

```sql
CREATE DATABASE KYHBlogTest;
```

### 테스트 데이터 정리 오류

테스트 실행 후 데이터가 남아있다면 `cleanUpDB`가 제대로 호출되지 않았을 수 있습니다. 테스트가 정상적으로 완료되었는지 확인하세요.

### 로그가 출력되지 않음

로그 레벨이 너무 낮게 설정되어 있을 수 있습니다. 더 높은 로그 레벨로 실행해보세요:

```bash
npm run gkd5  # 로그 레벨 5로 실행
```

