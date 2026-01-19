# 똑딱 데이트 백엔드 (Date-Ddalkkak Backend)

AI 기반 데이트 코스 추천 서비스의 백엔드 API 서버입니다.

## 기술 스택

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Build Tool**: Gradle 8.5
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **Authentication**: Spring Security (OAuth2)
- **API Documentation**: SpringDoc OpenAPI 3

## 프로젝트 구조

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ddalkkak/date/
│   │   │       ├── controller/     # REST API 컨트롤러
│   │   │       ├── service/        # 비즈니스 로직
│   │   │       ├── repository/     # 데이터 접근 계층
│   │   │       ├── entity/         # JPA 엔티티
│   │   │       ├── dto/            # 데이터 전송 객체
│   │   │       ├── config/         # 설정 클래스
│   │   │       ├── exception/      # 예외 처리
│   │   │       └── DateDdalkakApplication.java
│   │   └── resources/
│   │       ├── application.yml     # 기본 설정
│   │       └── application-dev.yml # 개발 환경 설정
│   └── test/
│       └── java/
└── build.gradle
```

## 시작하기

### 사전 요구사항

- Java 17 이상
- PostgreSQL 15
- Redis (선택사항)

### 데이터베이스 설정

PostgreSQL에 데이터베이스를 생성합니다:

```sql
CREATE DATABASE ddalkkak_date_dev;
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정합니다:

```bash
DB_USERNAME=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 애플리케이션 실행

```bash
# 개발 모드로 실행
./gradlew bootRun --args='--spring.profiles.active=dev'

# 또는 IDE에서 실행
# Active profiles: dev
```

서버가 `http://localhost:8080/api`에서 시작됩니다.

## API 문서

애플리케이션 실행 후 Swagger UI를 통해 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI Spec: http://localhost:8080/api/v3/api-docs

## 헬스체크

서버 상태를 확인하려면 헬스체크 엔드포인트를 호출합니다:

```bash
curl http://localhost:8080/api/health
```

응답 예시:
```json
{
  "status": "UP",
  "service": "date-ddalkkak",
  "timestamp": "2026-01-19T15:30:00",
  "version": "0.0.1-SNAPSHOT"
}
```

## 빌드

```bash
# 프로젝트 빌드
./gradlew build

# 테스트 실행
./gradlew test

# JAR 파일 생성
./gradlew bootJar
```

빌드된 JAR 파일은 `build/libs/` 디렉토리에 생성됩니다.

## 개발 가이드

### 코딩 규칙

- 주석은 한국어로 작성
- 변수명/함수명은 영어 사용
- Lombok 애노테이션 활용
- REST API는 RESTful 원칙 준수

### 커밋 메시지

```
[SCRUM-40] Spring Boot 백엔드 프로젝트 초기화
```

## 라이센스

이 프로젝트는 비공개 프로젝트입니다.
