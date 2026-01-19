# 똑딱 데이트 (Ddalkkak Date)

> AI 기반 데이트 코스 추천 서비스

Z세대 커플의 데이트 계획 시 겪는 정보 과잉과 결정 피로를 해결하는 서비스입니다. 3분 안에, 딸깍 한 번으로 완성되는 완벽한 데이트 코스를 제공합니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)

## 🎯 프로젝트 개요

**핵심 가치 제안**: "3분 안에, 딸깍 한 번으로 완성되는 완벽한 데이트"

### 주요 기능

1. **지역 선택**: 서울 12개 지역 인터랙티브 맵
2. **코스 옵션 선택**: 데이트 유형, 시간대, 예산 설정
3. **AI 코스 생성**: LLM 기반 2-3개 장소 연결 코스 추천
4. **커스터마이징**: 장소 변경 및 순서 조정
5. **실행 지원**: 카카오톡 공유, 지도 네비게이션

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.x
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **ORM**: Spring Data JPA
- **Database**: PostgreSQL 15
- **Authentication**: Spring Security + OAuth2

### AI/ML
- **Primary LLM**: OpenAI GPT-4 Turbo
- **Fallback LLM**: Anthropic Claude 3.5 Sonnet
- **Observability**: Langfuse

## 🚀 로컬 개발 환경 설정

### 사전 요구사항

- Docker Desktop 설치 ([설치 가이드](https://www.docker.com/products/docker-desktop))
- Docker Compose (Docker Desktop에 포함됨)

### 1. 환경 변수 설정

프로젝트 루트 디렉토리에서 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

필요한 경우 `.env` 파일을 열어 환경 변수를 수정합니다.

### 2. Docker Compose로 전체 환경 실행

```bash
# 모든 서비스 시작 (백그라운드 실행)
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 3. 서비스 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **API 문서 (Swagger)**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5432

### 4. 서비스 중지 및 제거

```bash
# 서비스 중지
docker-compose stop

# 서비스 중지 및 컨테이너 제거
docker-compose down

# 서비스 중지, 컨테이너 및 볼륨 제거 (데이터베이스 데이터 포함)
docker-compose down -v
```

### 개발 모드 특징

- **프론트엔드**: Hot Module Replacement (HMR) 지원
- **백엔드**: Spring Boot DevTools를 통한 자동 재시작
- **데이터베이스**: 데이터 영속성 보장 (볼륨 마운트)
- **소스 코드 동기화**: 로컬 파일 변경 시 즉시 반영

## 📁 프로젝트 구조

```
ddalkkak-date/
├── frontend/              # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/          # Next.js App Router 페이지
│   │   ├── components/   # React 컴포넌트
│   │   ├── lib/          # 유틸리티 함수
│   │   └── styles/       # 전역 스타일
│   ├── Dockerfile        # 프론트엔드 Docker 설정
│   └── package.json
├── backend/              # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java 소스 코드
│   │   │   └── resources/ # 설정 파일
│   │   └── test/        # 테스트 코드
│   ├── Dockerfile       # 백엔드 Docker 설정
│   └── build.gradle     # Gradle 빌드 설정
├── docker-compose.yml   # Docker Compose 설정
├── .env.example         # 환경 변수 예시
├── prd.md              # 제품 요구사항 문서
└── README.md           # 이 파일
```

## 👨‍💻 개발 가이드

### 개별 서비스 실행 (Docker 없이)

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
./gradlew bootRun
```

**참고**: 개별 실행 시 PostgreSQL은 별도로 실행해야 합니다.

### 데이터베이스 접속

```bash
# PostgreSQL 컨테이너 접속
docker-compose exec postgres psql -U ddalkkak_user -d ddalkkak_db
```

### 문제 해결

#### 포트 충돌 발생 시

`.env` 파일에서 포트 번호를 변경합니다:

```env
FRONTEND_PORT=3001
BACKEND_PORT=8081
POSTGRES_PORT=5433
```

#### 컨테이너 재빌드

```bash
# 이미지 재빌드 후 실행
docker-compose up -d --build

# 특정 서비스만 재빌드
docker-compose up -d --build frontend
```

#### 볼륨 초기화 (데이터베이스 데이터 삭제)

```bash
docker-compose down -v
docker-compose up -d
```

## 📚 추가 문서

- [PRD (제품 요구사항 문서)](./prd.md)
- [Frontend 가이드](./frontend/README.md)
- [Backend 가이드](./backend/README.md)
- [프로젝트 가이드 (CLAUDE.md)](./CLAUDE.md)

## 📄 라이선스

This project is private and proprietary.
