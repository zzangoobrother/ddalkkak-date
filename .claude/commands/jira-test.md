# JIRA 티켓 테스트

JIRA 티켓 완료 정책에 따라 필수 테스트를 수행합니다.

## 작업 순서

1. 현재 브랜치와 변경된 파일을 확인합니다:
   ```bash
   git branch --show-current
   git diff main --name-only
   ```

2. 변경된 파일 경로를 분석하여 테스트 유형을 결정합니다:
   - `frontend/` 디렉토리: 프론트엔드 테스트
   - `backend/` 또는 Java 파일: 백엔드 테스트
   - 둘 다: 전체 테스트

3. **프론트엔드 테스트** (frontend/ 변경 시)

   a. 개발 서버가 실행 중인지 확인:
   ```bash
   cd frontend
   npm run dev
   ```

   b. Chrome DevTools MCP를 사용하여 브라우저 테스트:
   - `mcp__chrome-devtools__list_pages`: 페이지 목록 확인
   - `mcp__chrome-devtools__navigate_page`: http://localhost:3000 접속
   - `mcp__chrome-devtools__take_snapshot`: 페이지 스냅샷 캡처
   - `mcp__chrome-devtools__take_screenshot`: 스크린샷 저장
   - `mcp__chrome-devtools__list_console_messages`: 콘솔 에러 확인

   c. 주요 사용자 플로우 테스트:
   - UI 렌더링 확인
   - 인터랙티브 요소 동작 확인
   - 반응형 디자인 검증 (필요시 `resize_page` 사용)

   d. 테스트 결과 요약:
   - ✅ 페이지 렌더링 성공
   - ✅ UI 인터랙션 정상
   - ✅ 콘솔 에러 없음
   - ✅ 반응형 디자인 확인

4. **백엔드 테스트** (backend/ 변경 시)

   a. Spring Boot 애플리케이션 실행 확인:
   ```bash
   cd backend
   ./gradlew bootRun
   # 또는
   ./mvnw spring-boot:run
   ```

   b. API 엔드포인트 테스트 (Bash 도구 사용):
   ```bash
   # 예시: 헬스체크
   curl -X GET http://localhost:8080/actuator/health

   # 예시: 변경된 API 엔드포인트
   curl -X POST http://localhost:8080/api/courses \
     -H "Content-Type: application/json" \
     -d '{"region": "강남", "dateType": "로맨틱"}'
   ```

   c. 테스트 결과 검증:
   - 응답 상태 코드 확인
   - 응답 본문 구조 확인
   - 에러 케이스 테스트

5. 테스트 결과를 정리하여 사용자에게 보고합니다.

6. 테스트가 모두 통과하면:
   - PR에 테스트 결과 업데이트:
   ```bash
   gh pr comment --body "## 테스트 결과
   - ✅ [테스트 항목들...]

   모든 테스트가 통과했습니다. 리뷰 부탁드립니다."
   ```

7. 다음 단계 안내:
   - 리뷰 승인 후 `/jira-complete`로 머지

## 예외 처리

- 테스트 실패 시: 사용자에게 알리고 수정 필요
- 개발 서버가 실행 중이 아닐 때: 서버 시작 안내
- 문서화 작업만 있는 경우: 테스트 생략 가능

## 주의사항

- 실제 브라우저 테스트를 수행하며, 스크린샷을 저장합니다.
- API 테스트는 실제 응답을 확인합니다.
- 테스트 결과를 PR 코멘트로 자동 업데이트합니다.
