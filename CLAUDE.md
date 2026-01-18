# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**똑딱 데이트 (Date-Ddalkak)** - AI 기반 데이트 코스 추천 서비스

Z세대 커플의 데이트 계획 시 겪는 정보 과잉과 결정 피로를 해결하는 서비스입니다. 사용자가 서울 지역 맵에서 원하는 지역을 선택하고 데이트 유형과 예산을 입력하면, AI가 2-3곳의 연결된 최적 코스를 추천합니다.

**핵심 가치 제안**: "3분 안에, 딸깍 한 번으로 완성되는 완벽한 데이트"

## 개발 명령어

### Frontend (Next.js)

```bash
# frontend 디렉토리에서 실행
cd frontend

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 실행
npm run lint
```

## 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui (계획됨)
- **State Management**: Zustand (계획됨)
- **API Client**: TanStack Query (계획됨)
- **Animation**: Framer Motion (계획됨)
- **Maps**: Kakao Maps API / Naver Maps API (계획됨)
- **Deployment**: Vercel

### Backend (계획됨)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **ORM**: Spring Data JPA
- **Database**: AWS RDS PostgreSQL 15
- **Cache**: AWS ElastiCache Redis
- **Authentication**: Spring Security (OAuth2)
- **API Documentation**: SpringDoc OpenAPI
- **AI/ML**: OpenAI GPT-4 Turbo (Primary), Anthropic Claude 3.5 Sonnet (Fallback)
- **LLM Observability**: Langfuse
- **Deployment**: AWS ECS Fargate

## 아키텍처 개요

### 프론트엔드 구조

```
frontend/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── layout.tsx    # 루트 레이아웃 (Inter 폰트, 한국어 설정)
│   │   └── page.tsx      # 홈 페이지
│   ├── components/       # 재사용 가능한 React 컴포넌트
│   ├── lib/              # 유틸리티 함수 및 헬퍼
│   ├── styles/           # 전역 스타일 (globals.css)
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일
└── package.json
```

### TypeScript 경로 별칭

`@/` 접두사로 src 디렉토리를 참조할 수 있습니다:
```typescript
import { Component } from '@/components/Component'
import { utils } from '@/lib/utils'
```

### 핵심 기능 플로우 (MVP)

1. **지역 선택 (Step 1)**: 서울 12개 지역을 그리드 형태의 인터랙티브 맵으로 표시
   - 지역별 이모지, 코스 개수, 태그라인, HOT 배지 표시
   - 검색 및 현재 위치 기능

2. **코스 옵션 선택 (Step 2)**: 데이트 유형, 시간대, 예산 선택

3. **AI 코스 생성 (Step 3)**: LLM을 통한 2-3개 장소 연결 코스 추천
   - 동선 최적화
   - 실시간 정보 기반 큐레이션

4. **커스터마이징**: 장소 변경, 순서 조정

5. **실행 지원**: 카카오톡 공유, 지도 네비게이션

### 서울 지역 맵 데이터 구조

PRD에 정의된 12개 지역 (3x4 그리드):

**1열**: 종로·광화문 🏛️, 마포·홍대 🎨🔥, 성동·성수 🏭🔥, 영등포·여의도 🏙️
**2열**: 성북·혜화 🌳, 용산·이태원 🗼, 광진·건대 🎓, 서초·교대 🌸
**3열**: 중구·명동 🏢, 강남·역삼 💼🔥, 송파·잠실 🎢, 강동·천호 🌊

HOT 지역: 마포·홍대, 강남·역삼, 성동·성수

각 지역 객체는 다음 구조를 가집니다:
```typescript
{
  id: string
  name: string
  emoji: string
  availableCourses: number
  tagline: string
  hot: boolean
  position: { row: number, col: number }
}
```

### LLM 통합 아키텍처

- **Primary LLM**: OpenAI GPT-4 Turbo
- **Fallback LLM**: Anthropic Claude 3.5 Sonnet
- **Observability**: Langfuse를 통한 프롬프트 버전 관리, 비용 모니터링, A/B 테스트

### 데이터 플로우

```
User → Next.js Frontend (Vercel)
    → AWS ALB
    → Spring Boot Backend (ECS Fargate)
    → [PostgreSQL (RDS) + Redis (ElastiCache)]
    → OpenAI LLM API
```

## Git 워크플로우

### 브랜치 전략

**메인 브랜치**:
- `main`: 프로덕션 배포 브랜치 (항상 배포 가능한 상태 유지)

**작업 브랜치 네이밍 규칙**:
- JIRA 티켓 기반: `feature/[JIRA-티켓번호]-[간단한-설명]`
  - 예: `feature/DD-123-add-region-map`
  - 예: `feature/DD-124-course-recommendation-api`
- 버그 수정: `bugfix/[JIRA-티켓번호]-[간단한-설명]`
  - 예: `bugfix/DD-125-fix-map-rendering`
- 핫픽스: `hotfix/[JIRA-티켓번호]-[간단한-설명]`

### JIRA 티켓 기반 작업 프로세스

1. **티켓 할당 및 브랜치 생성**
   ```bash
   # main 브랜치에서 최신 코드 가져오기
   git checkout main
   git pull origin main

   # 새 작업 브랜치 생성
   git checkout -b feature/DD-123-add-region-map
   ```

2. **개발 및 커밋**
   ```bash
   # 변경사항 커밋 (커밋 메시지에 티켓 번호 포함)
   git add .
   git commit -m "[DD-123] 서울 지역 맵 그리드 컴포넌트 추가"
   ```

3. **원격 저장소에 푸시 및 Pull Request 생성**
   ```bash
   # 원격 저장소에 푸시하면서 PR 생성 (gh CLI 사용)
   git push origin feature/DD-123-add-region-map

   # PR 생성 (대화형)
   gh pr create --title "[DD-123] 서울 지역 맵 그리드 컴포넌트 추가" \
     --body "## 변경사항
   - 서울 12개 지역 그리드 컴포넌트 구현
   - 지역별 이모지, HOT 배지 표시 기능 추가

   ## JIRA 티켓
   https://your-jira.atlassian.net/browse/DD-123

   ## 테스트 결과
   - [x] Playwright 브라우저 테스트 통과
   - [x] 반응형 디자인 검증 완료
   - [x] 콘솔 에러 없음" \
     --assignee @me

   # 또는 에디터로 PR 본문 작성
   gh pr create
   ```

4. **PR 상태 확인**
   ```bash
   # 현재 브랜치의 PR 상태 확인
   gh pr status

   # PR 상세 정보 확인
   gh pr view

   # 웹 브라우저에서 PR 열기
   gh pr view --web
   ```

5. **코드 리뷰 및 테스트**
   ```bash
   # 리뷰어 추가
   gh pr edit --add-reviewer username1,username2

   # 라벨 추가
   gh pr edit --add-label "frontend,enhancement"
   ```

   - CI/CD 파이프라인 통과 확인
   - 프론트엔드: Playwright MCP로 브라우저 테스트
   - 백엔드: API 통합 테스트
   - 리뷰어 피드백 반영 후 추가 커밋 & 푸시

6. **머지 및 티켓 완료**
   ```bash
   # PR 승인 후 main 브랜치로 머지 (Squash & Merge)
   gh pr merge --squash --delete-branch

   # 또는 대화형 머지
   gh pr merge

   # 로컬 main 브랜치 업데이트
   git checkout main
   git pull origin main
   ```

   - JIRA 티켓 상태를 "완료"로 변경
   - 테스트 결과를 JIRA 티켓 코멘트에 기록

### 유용한 gh CLI 명령어

```bash
# 내 PR 목록 확인
gh pr list --author @me

# 특정 PR 체크아웃
gh pr checkout 123

# PR에 코멘트 추가
gh pr comment 123 --body "LGTM!"

# PR 병합 전 체크
gh pr checks

# PR diff 확인
gh pr diff

# PR 재오픈
gh pr reopen 123
```

### 커밋 메시지 규칙

**형식**: `[티켓번호] 동사 + 명사 형태의 간결한 설명`

**예시**:
- `[DD-123] 서울 지역 맵 그리드 컴포넌트 추가`
- `[DD-124] AI 코스 추천 API 엔드포인트 구현`
- `[DD-125] 지역 선택 버튼 클릭 이벤트 버그 수정`
- `[DD-126] LLM 프롬프트 템플릿 리팩토링`

**작업 유형별 동사**:
- 추가: `추가`, `생성`, `구현`
- 수정: `수정`, `변경`, `개선`
- 삭제: `삭제`, `제거`
- 버그 수정: `수정`, `해결`
- 리팩토링: `리팩토링`, `정리`
- 문서화: `문서 추가`, `문서 업데이트`

### 주의사항

- **절대 main 브랜치에 직접 커밋하지 않기**
- 모든 변경사항은 반드시 작업 브랜치를 통해 PR로 진행
- PR은 JIRA 티켓 완료 정책의 테스트를 모두 통과한 후에만 머지
- 커밋 메시지에 반드시 JIRA 티켓 번호 포함

### Claude 커스텀 명령어

JIRA 티켓 기반 워크플로우를 자동화하는 커스텀 명령어들을 제공합니다.

#### 사용 가능한 명령어

1. **`/jira-start`** - JIRA 티켓 작업 시작
   - 새로운 작업 브랜치 생성 및 전환
   - 티켓 번호, 유형, 설명을 입력받아 자동으로 브랜치 생성
   - 예: `feature/DD-123-add-region-map`

2. **`/jira-pr`** - Pull Request 생성
   - 변경사항 커밋 및 푸시
   - GitHub CLI로 PR 자동 생성
   - PR 템플릿에 JIRA 티켓 링크 및 테스트 체크리스트 포함

3. **`/jira-test`** - 티켓 완료 전 테스트 수행
   - 프론트엔드: Chrome DevTools MCP로 브라우저 테스트
   - 백엔드: API 통합 테스트
   - 테스트 결과를 PR 코멘트로 자동 업데이트

4. **`/jira-complete`** - PR 머지 및 티켓 완료
   - PR 체크 및 머지 (Squash & Merge)
   - 작업 브랜치 자동 삭제
   - JIRA 티켓 완료 안내

#### 워크플로우 예시

```bash
# 1. 티켓 작업 시작
/jira-start
# → 티켓 번호: DD-123
# → 유형: feature
# → 설명: add-region-map

# 2. 코드 작성 후 PR 생성
/jira-pr

# 3. 테스트 수행
/jira-test

# 4. 리뷰 승인 후 완료
/jira-complete
```

#### 명령어 위치

모든 커스텀 명령어는 `.claude/commands/` 디렉토리에 있습니다:
- `.claude/commands/jira-start.md`
- `.claude/commands/jira-pr.md`
- `.claude/commands/jira-test.md`
- `.claude/commands/jira-complete.md`

## 코딩 규칙

### 언어 및 커뮤니케이션
- **UI 텍스트**: 한국어 (Z세대 타겟 고려)
- **코드 주석**: 한국어
- **커밋 메시지**: 한국어
- **문서화**: 한국어
- **변수명/함수명**: 영어 (코드 표준 준수)

### 스타일링
- Tailwind CSS 사용 (utility-first)
- 반응형 디자인 필수 (모바일 우선)
- 다크모드는 Phase 2

### 접근성
- 키보드 네비게이션 지원
- ARIA 레이블 제공
- Screen Reader 호환성

### 성능
- Next.js 이미지 최적화 활용
- 코드 스플리팅
- 초기 로딩 3초 이내 목표

## JIRA 티켓 완료 정책

**중요**: JIRA 티켓을 완료 처리하기 전에 반드시 아래 테스트를 수행해야 합니다.

### 프론트엔드 변경 사항
- **Playwright MCP 활용**: `mcp__playwright` 도구를 사용하여 브라우저 테스트 수행
  - 페이지 렌더링 확인 (`browser_navigate`, `browser_snapshot`)
  - UI 인터랙션 테스트 (`browser_click`, `browser_fill_form`)
  - 반응형 디자인 검증 (`browser_resize`)
  - 스크린샷 캡처 및 비교 (`browser_take_screenshot`)
- 주요 사용자 플로우가 정상 작동하는지 확인
- 콘솔 에러 확인 (`browser_console_messages`)

### 백엔드 변경 사항
- **실제 API 호출 테스트**: `Bash` 도구를 사용하여 통합 테스트 수행
  - `curl` 또는 `http` 명령어로 API 엔드포인트 호출
  - 응답 상태 코드 확인 (200, 201, 400, 404, 500 등)
  - 응답 본문 검증 (JSON 구조, 필수 필드)
  - 에러 케이스 테스트 (잘못된 입력, 권한 없음 등)
- Spring Boot 애플리케이션 실행 확인
- 데이터베이스 연동 확인 (필요시)

### 테스트 완료 후
1. 테스트 결과를 JIRA 티켓 코멘트에 간단히 기록
2. 스크린샷 또는 API 응답 예시 첨부 (선택사항)
3. 모든 테스트가 통과한 경우에만 티켓을 완료 상태로 전환

### 예외 사항
- 문서화 작업만 포함된 티켓
- 설정 파일 변경만 포함된 티켓 (단, 설정 적용 확인은 필요)
- 리팩토링 작업 (단, 기존 기능이 정상 작동하는지 확인 필요)

## 주요 참고 문서

- **PRD**: `/prd.md` - 전체 제품 요구사항 및 MVP 스펙 (41,919 토큰)
- **Frontend README**: `/frontend/README.md` - 프론트엔드 가이드
