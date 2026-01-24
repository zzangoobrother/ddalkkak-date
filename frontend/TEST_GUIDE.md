# 코스 생성 플로우 테스트 가이드

## SCRUM-21: 코스 생성 플로우 구현 완료

이 문서는 SCRUM-21에서 구현된 전체 코스 생성 플로우를 테스트하는 방법을 안내합니다.

## 🎯 구현 완료 항목

### 1. 타입 정의
- `frontend/src/types/course.ts`에 `CourseResponse`, `PlaceInCourse` 타입 추가

### 2. API 클라이언트
- `frontend/src/lib/api.ts` - 백엔드 `/courses/generate` API 호출 함수

### 3. UI 컴포넌트
- `frontend/src/components/CourseLoading.tsx` - 코스 생성 중 로딩 화면
- `frontend/src/components/CourseResult.tsx` - 생성된 코스 결과 화면

### 4. 통합 플로우
- `frontend/src/app/page.tsx` - 전체 플로우 상태 관리 및 API 호출 로직
  - Step 1-3 입력 → 로딩 → 결과 표시 → 에러 처리

## 🚀 테스트 방법

### 사전 준비

1. **환경변수 설정** (선택사항)
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # 필요시 API_URL 수정 (기본값: http://localhost:8080)
   ```

2. **백엔드 서버 실행**
   ```bash
   cd backend
   ./gradlew bootRun
   # 또는
   ./gradlew build && java -jar build/libs/*.jar
   ```

3. **프론트엔드 서버 실행**
   ```bash
   cd frontend
   npm install  # 최초 1회만
   npm run dev
   ```

4. **서버 준비 완료 확인**
   - 백엔드: http://localhost:8080/actuator/health
   - 프론트엔드: http://localhost:3000

### 테스트 시나리오

#### 시나리오 1: 정상 플로우
1. http://localhost:3000 접속
2. **Step 1**: 서울 지역 맵에서 "마포·홍대" 선택
3. **Step 2**: "저녁 식사 데이트" 선택
4. **Step 3**: "3-5만원" 예산 선택 → "코스 생성하기" 클릭
5. **로딩 화면** 표시 확인 (10-15초)
6. **결과 화면** 확인:
   - 코스 이름 및 설명
   - 총 소요시간, 총 예산
   - 2-3개 장소 카드 (순서, 이름, 주소, 추천 메뉴 등)
   - "카카오톡으로 공유하기" 버튼
   - "새로운 코스 만들기" 버튼

#### 시나리오 2: 에러 처리
1. 백엔드 서버를 종료
2. 프론트엔드에서 코스 생성 시도
3. **에러 화면** 확인:
   - 에러 이모지 및 메시지
   - "다시 시도하기" 버튼
   - "처음으로 돌아가기" 버튼

#### 시나리오 3: 재시도
1. 결과 화면에서 "새로운 코스 만들기" 클릭
2. Step 1로 돌아가는지 확인
3. 다른 지역/유형/예산으로 코스 생성

### 콘솔 확인 사항

브라우저 개발자 도구 콘솔에서 다음 이벤트 확인:
- `course_generation_started`
- `course_generation_completed` (또는 `course_generation_failed`)
- `course_input_reset`

### API 응답 확인

개발자 도구 Network 탭에서:
- `POST http://localhost:8080/courses/generate`
- 요청 본문:
  ```json
  {
    "regionId": "mapo",
    "dateTypeId": "dinner",
    "budgetPresetId": "30k-50k"
  }
  ```
- 응답 본문:
  ```json
  {
    "courseId": "course-...",
    "courseName": "...",
    "places": [...]
  }
  ```

## 🐛 알려진 이슈

- 백엔드 Gemini API 키가 설정되지 않은 경우 코스 생성 실패
- 데이터베이스가 비어있는 경우 장소 추천 불가

## 📝 추가 개선 사항 (Phase 2)

- [ ] 카카오톡 공유 기능 구현
- [ ] 코스 저장 및 히스토리
- [ ] 장소 변경/순서 조정 (커스터마이징)
- [ ] 지도에서 코스 경로 시각화

## ✅ JIRA 티켓 완료 체크리스트

- [x] 3단계 입력 플로우 구현
- [x] 백엔드 API 호출 통합
- [x] 로딩 상태 UI
- [x] 코스 결과 화면
- [x] 에러 처리 및 재시도
- [x] Analytics 이벤트 추적
- [x] 환경변수 설정 문서화
- [ ] Playwright 브라우저 테스트 (수동 테스트로 대체)
