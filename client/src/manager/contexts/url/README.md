# URL Context

URL 상태 관리를 담당하는 Context입니다.

## 개요

URL Context는 현재 URL 경로를 관리하고, URL 변경 시 필요한 작업을 수행합니다. React Router와 연동하여 사용됩니다.

## 파일 구조

```
url/
├── __states.tsx      # URL 상태 관리 (현재 비어있음)
├── _callbacks.tsx    # URL 관련 콜백 함수 (현재 비어있음)
├── _effects.tsx     # URL 관련 사이드 이펙트
├── _provider.tsx    # Provider 조합
├── index.ts         # Export 모음
└── README.md        # 문서
```

## 주요 기능

### 1. 상태 관리 (`__states.tsx`)

현재 상태는 비어있으며, 향후 URL 관련 상태를 추가할 수 있습니다.

### 2. 콜백 함수 (`_callbacks.tsx`)

현재 콜백 함수는 없으며, 향후 URL 관련 작업을 추가할 수 있습니다.

### 3. 사이드 이펙트 (`_effects.tsx`)

URL 변경 시 자동으로 실행되는 효과:

- **URL 변경 감지**: React Router의 `location` 변경 감지
- **필요한 초기화 작업**: URL 변경 시 관련 상태 초기화 등

## 주의사항

1. **현재 상태**: URL Context는 현재 기본 구조만 제공하며, 실제 기능은 향후 추가될 예정입니다.
2. **React Router 연동**: React Router의 `location`을 감지하여 URL 변경을 추적합니다.

## 관련 파일

- React Router: `react-router-dom`
- URL 관련 컴포넌트: `client/src/template/`
