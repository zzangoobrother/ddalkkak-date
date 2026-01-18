# 똑딱 데이트 - Frontend

AI 기반 데이트 코스 추천 서비스의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Formatting**: Prettier

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

### 린트

```bash
npm run lint
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   ├── components/       # 재사용 가능한 React 컴포넌트
│   ├── lib/              # 유틸리티 함수 및 라이브러리
│   ├── styles/           # 전역 스타일
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일
└── package.json
```

## 개발 가이드

- 모든 코드는 TypeScript로 작성합니다.
- 컴포넌트는 `src/components/` 디렉토리에 작성합니다.
- Tailwind CSS를 사용하여 스타일링합니다.
- Prettier를 사용하여 코드 포맷팅을 유지합니다.
