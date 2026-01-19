# Stage 1: Builder
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app

# Gradle 설정 파일 복사
COPY build.gradle settings.gradle ./
COPY src ./src

# 애플리케이션 빌드
RUN gradle build -x test --no-daemon

# Stage 2: Development
FROM eclipse-temurin:17-jdk AS development
WORKDIR /app

# Gradle 설치 (개발 환경에서 hot reload를 위해)
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.5-bin.zip && \
    unzip gradle-8.5-bin.zip -d /opt && \
    ln -s /opt/gradle-8.5/bin/gradle /usr/bin/gradle && \
    rm gradle-8.5-bin.zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8080

# Spring Boot DevTools를 활용한 개발 서버 실행
CMD ["gradle", "bootRun", "--no-daemon"]

# Stage 3: Production
FROM eclipse-temurin:17-jre AS production
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
