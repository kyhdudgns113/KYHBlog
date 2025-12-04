# AI 작업 지시사항 가이드

이 파일은 AI가 작업을 수행할 때 참고해야 할 프로젝트 규칙과 가이드라인을 기록합니다.

## 기본 원칙

### 1. 파일 및 폴더 구조
- **컴포넌트 구조**: `parts`, `objects`, `buttons`, `groups`, `elements`, `features` 등으로 구분
  - 사용하는 이름 목록은 다음과 같이 알파벳 순으로 있다.
    - parts
    - objects
    - modules (잘 안씀)
    - groups
    - features (잘 안쓴다)
    - elements (잘 안쓴다)
    - components
    - buttons (버튼들은 주로 이걸 쓴다)
    - addons
  - parts 는 parts, objects 나 그 외의 것들로 이루어질 수 있다.
  - objects 는 parts 로 이루어질 수 없다.
    - 알파벳 뒷 순서를 import 할 수 없다 (FSD 규칙)
- **파일명**: PascalCase 사용, **반드시 Part/Object/Button 등의 접미사를 포함** (예: `QnAHeaderPart.tsx`, `HeaderButtonRowObject.tsx`)
  - 폴더명에는 접미사가 없을 수 있지만, 파일명에는 반드시 포함되어야 함
  - 예: 폴더명 `HeaderBtnRow/`, 파일명 `HeaderBtnRowPart.tsx`
- **폴더명**: PascalCase 사용 (예: `QnAHeaderPart/` 또는 `HeaderBtnRow/`)
- **각 컴포넌트 폴더 구조**:
  ```
  ComponentName/
    - ComponentName.tsx
    - ComponentName.scss
    - index.ts (export * from './ComponentName')
  ```

### 2. SCSS 파일 규칙

#### 경로 규칙
- `@use` 경로는 항상 `src/base/styles/values.scss`를 기준으로 계산
- **경로 계산 방법**:
  1. 파일 위치에서 `src` 폴더까지의 폴더 깊이를 계산
  2. 각 폴더 단계마다 `../` 하나씩 추가
  3. `src` 다음에 `base/styles/values.scss` 경로 추가
- **계산 예시**:
  - `client/src/pages/QnA/QnARead_Page/parts/QnAHeaderPart/QnAHeaderPart.scss`
    - 경로: `QnAHeaderPart` → `parts` → `QnARead_Page` → `QnA` → `pages` → `src` → `base/styles`
    - 6단계 위로: `../../../../../base/styles/values.scss`
  - `client/src/pages/QnA/QnARead_Page/QnAReadPage.scss`
    - 경로: `QnARead_Page` → `QnA` → `pages` → `src` → `base/styles`
    - 4단계 위로: `../../../../base/styles/values.scss`
  - `client/src/pages/QnA/QnAWrite_Page/parts/QnAForm/QnAFormPart.scss`
    - 경로: `QnAForm` → `parts` → `QnAWrite_Page` → `QnA` → `pages` → `src` → `base/styles`
    - 6단계 위로: `../../../../../base/styles/values.scss`
- **주의**: 경로 계산 시 실수가 발생하기 쉬우므로, 파일 위치를 정확히 확인하고 단계별로 계산해야 함

#### 계층 구조
- SCSS는 반드시 `.Template` 부터 시작하는 계층 구조 사용
- 예시:
  ```scss
  .Template {
    .QnAPage {
      .QnAHeader_Part {
        // 스타일
      }
    }
  }
  ```
- 계층: `.Template -> .PageName -> .PartName -> .ObjectName` 순서

#### 클래스명 규칙
- 컴포넌트 클래스명: `ComponentName_Part`, `ComponentName_Object` 형식
- 내부 클래스: `_internal_class` 형식 (언더스코어로 시작)

### 3. TypeScript 규칙

#### Props 타입
- `DivCommonProps`, `TableCommonProps`, `ButtonCommonProps` 등 `@prop`에서 import
- 컴포넌트 Props는 `ComponentNameProps` 형식
- 예시:
  ```typescript
  type QnAHeaderPartProps = DivCommonProps & {}
  ```

#### 컴포넌트 구조
- `FC` 타입 사용
- 기본 구조:
  ```typescript
  import type {FC} from 'react'
  import type {DivCommonProps} from '@prop'
  
  import './ComponentName.scss'
  
  type ComponentNameProps = DivCommonProps & {}
  
  export const ComponentName: FC<ComponentNameProps> = ({className, ...props}) => {
    return (
      <div className={`ComponentName_Part ${className || ''}`} {...props}>
        {/* 내용 */}
      </div>
    )
  }
  ```

#### Import 순서
1. 컴포넌트 import (상대 경로)
2. 타입 import (`type` 키워드 사용)
3. SCSS import

### 4. 컴포넌트 네이밍 규칙

#### Part 컴포넌트
- 페이지의 주요 섹션을 담당
- 예: `QnAHeaderPart`, `QnATablePart`, `QnAPagingPart`

#### Object 컴포넌트
- Part 내부의 독립적인 기능 단위
- 예: `HeaderButtonRowObject`

#### Button 컴포넌트
- 버튼 컴포넌트
- 예: `WriteQnAButton`

### 5. 작업 시 주의사항

#### API 연동
- API가 아직 작성되지 않은 경우, TODO 주석으로 표시
- 예: `// TODO: 질문 작성 페이지로 이동`

#### 원형 작업
- "원형만 완성" 요청 시:
  - 기본 구조만 작성
  - 내용물은 주석이나 간단한 플레이스홀더로 표시
  - 스타일은 최소한만 적용

#### 파일 생성 시
- 항상 `index.ts` 파일도 함께 생성하여 export 설정
- 상위 폴더의 `index.ts`에도 export 추가

#### 린터 확인
- 작업 완료 후 항상 `read_lints`로 에러 확인
- 에러가 있으면 반드시 수정

### 6. 코드 스타일

#### 주석
- 한국어 주석 사용
- 섹션 구분: `{/* 1. 섹션명 */}`, `{/* 2. 섹션명 */}` 형식

#### 빈 규칙셋 방지
- SCSS에서 빈 규칙셋이 있으면 최소한의 스타일이라도 추가
- 예: `display: block;` 또는 `display: flex;`

### 7. 특수 규칙

#### div 내부 텍스트
- 원형 작업 시 div 내부 텍스트는 **파일명 전체(확장자 포함)**로 표시
- 예: `<div>HeaderBtnRowPart.tsx</div>`, `<div>QnAWrittingPart.tsx</div>`

#### className 처리
- `className` prop이 있으면 `${className || ''}` 형식으로 병합
- 단, 원형 작업 시에는 생략 가능

### 8. 경로 Alias

#### Client (`@` 접두사)
- `@prop`: `src/base/types/props`
- `@component`: `src/base/components`
- `@context`: `src/manager/contexts`
- `@redux`: `src/manager/redux`
- `@shareType`: `src/base/types/shareTypes`
- `@shareValue`: `src/base/values/shareValues`
- 기타: `tsconfig.app.json` 참고

### 9. 작업 흐름

1. 관련 파일 및 구조 확인 (`read_file`, `list_dir`, `codebase_search`)
2. 유사한 컴포넌트 패턴 확인
3. 파일 생성/수정
4. SCSS 경로 및 계층 구조 확인
5. 린터 에러 확인 및 수정
6. 관련 파일들의 import/export 업데이트

### 10. 주의할 점

- **절대 추측하지 말 것**: 모르는 부분은 반드시 코드베이스 검색으로 확인
- **일관성 유지**: 기존 패턴을 따라야 함
- **경로 정확성**: SCSS `@use` 경로는 반드시 정확히 계산
  - 파일 위치에서 `src`까지의 폴더 깊이를 정확히 세어서 계산
  - 계산 후 다른 유사한 파일의 경로와 비교하여 검증
- **계층 구조**: SCSS 계층 구조는 반드시 `.Template`부터 시작

### 11. 커밋 메시지 규칙

- 커밋 메시지는 다음과 같이 구성되어있다.
  1. 타이틀
    - 날짜, 브랜치명, 타이틀 본문으로 구성된다.
    - 날짜는 "25.11.30" 형식으로 쓴다. (년도.월.일)
    - 브랜치명은 대괄호 안에 적는다.
      - 예: `[Client]`, `[Client2]`, `[Server]` 등
    - 이모지는 타이틀 본문 앞에 사용할 수 있다.
      - 패턴 1: `25.11.30 [Client] :sparkles: 새로운 기능 추가`
    - 타이틀 본문은 커밋 내용을 바탕으로 작성한다.
      - 커밋 내용을 최대한 요약하되, 구분이 필요한 경우는 / 로 구분한다.
      - 적절한 이모지를 사용해도 되며, _GIT_EMOJI_RULE.md 파일을 참고한다.
  2. 커밋 내용 (타이틀과 한 줄 띄고 작성)
    - 타이틀 밑의 첫 번째 줄은 맨 왼쪽에 붙여서 작성한다. (들여쓰기 없음)
    - 그동안 무슨 작업을 했는지 적절히 한 줄 씩 작성한다.
    - 각 줄의 맨 앞에는 적절한 이모지를 붙여준다.
    - **Client와 Server 폴더 두 군데에서 작업한 경우**, 각 줄에 `[Client]` 또는 `[Server]`를 표시하여 어디서 작업했는지 명시한다.
      - 예: `:sparkles: [Client] 회원가입 UI 추가`, `:sparkles: [Server] 회원가입 API 추가`
    - 만약 Client 와 Server 폴더 두 군데서 같은 작업을 했다면 `[Both] 로 표시한다.
      - 예: `:sparkles: [Both] QnAType 추가`
    - 트리 형식으로 작성해도 된다.
      - 첫 번째 줄은 맨 왼쪽에 붙이고, 그 아래 자식 줄들은 들여쓰기를 활용한다.
    - :construction: 이모지가 붙은 행은 건드리지 않는다.
      - 그 줄과 관련된 작업내용이 있다면 바로 밑줄에 탭을 띄워 자식 줄을 만들고 내용을 작성한다.
      - **중요**: `:construction:` 항목이 있는 경우, 해당 항목과 관련된 모든 작업은 반드시 그 항목의 하위 항목으로 배치해야 한다.
        - 예: `:construction: [Client] QnA 게시글 페이지 작성중...` 항목이 있다면, QnA 게시글 페이지와 관련된 모든 작업(컴포넌트 추가, 수정 등)은 이 항목의 하위 항목으로 작성해야 한다.
        - 트리 구조로 계층을 명확히 표현하여, 어떤 작업이 어떤 진행중인 작업의 일부인지 명확히 해야 한다.

#### 커밋 메시지 예시

```
25.11.30 [BranchName] :sparkles: 템플릿 코드 작성

:sparkles: 새로운 템플릿 구조 추가
  - :sparkles: 모달 컴포넌트 집합 추가
:art: 코드 포맷팅 개선
```

또는

```
25.11.30 [BranchName] :sparkles: 회원가입 기능 추가

:sparkles: [Client] 회원가입 UI 추가
:sparkles: [Server] 회원가입 API 추가
```

또는 `:construction:` 항목이 있는 경우:

```
25.12.04 [Client] :sparkles: QnARow 컴포넌트 추가

:construction: [Client] QnA 페이지 제작중...
  - :construction: [Client] QnA 게시글 페이지 작성중...
    - :sparkles: [Client] QnARow 컴포넌트 생성 (objects 폴더)
      - :sparkles: [Client] QnARowObject.tsx 생성 (테이블 행 컴포넌트)
      - :sparkles: [Client] 날짜 포맷팅 함수 추가
    - :pencil2: [Client] QnATablePart 수정 (QnARowObject 사용)
  - :white_large_square: [Client] QnA 페이징 컴포넌트
```

**주의**: `:construction:` 항목과 관련된 모든 작업은 반드시 해당 항목의 하위 항목으로 배치해야 한다.

---

## 업데이트 기록

- 생성일: 2025-11-30
- 마지막 업데이트: 2025-12-04
- 파일명 규칙 및 원형 작업 div 내용 규칙 추가: 2025-11-30
- 커밋 메시지 `:construction:` 항목 하위 작업 배치 규칙 추가: 2025-12-04
- SCSS 경로 계산 방법 상세 설명 추가: 2025-12-04

