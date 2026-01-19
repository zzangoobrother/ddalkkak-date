# Stage 1: Builder
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app

# Gradle 설정 파일 복사
COPY build.gradle settings.gradle ./
COPY src ./src

# 애플리케이션 빌드
RUN gradle build -x test --no-daemon

# Stage 2: Development
FROM eclipse-temurin:17-jdk-alpine AS development
WORKDIR /app

# Gradle 설치 (개발 환경에서 hot reload를 위해)
RUN apk add --no-cache gradle

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8080

# Spring Boot DevTools를 활용한 개발 서버 실행
CMD ["gradle", "bootRun", "--no-daemon"]

# Stage 3: Production
FROM eclipse-temurin:17-jre-alpine AS production
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
