# 장소 데이터 수집 시스템

SCRUM-17 티켓 구현: Kakao Local API를 통한 장소 데이터 수집 및 Claude AI를 통한 자동 큐레이션 시스템

## 개요

서울 12개 지역의 데이트 장소 데이터를 자동으로 수집하고, AI가 각 장소의 데이트 적합도를 분석하여 큐레이션 정보를 제공합니다.

## 주요 기능

### 1. Kakao Local API 연동
- 카테고리별 장소 검색 (카페, 음식점, 문화시설, 관광명소)
- 키워드 기반 장소 검색
- 지역 중심 좌표 기반 반경 검색 (2km)

### 2. Claude AI 큐레이션
각 장소에 대해 다음 5가지 정보를 자동 분석:
1. **date_score**: 데이트 적합도 점수 (1-10점)
2. **mood_tags**: 장소 분위기 해시태그 (최대 3개)
3. **price_range**: 1인당 예상 가격대
4. **best_time**: 추천 시간대
5. **recommendation**: 한 줄 추천 이유

### 3. 데이터 검증 및 정제
- 중복 데이터 자동 제거
- 필수 필드 검증
- 좌표 유효성 검사

## 데이터베이스 스키마

```sql
CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,
    kakao_place_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address VARCHAR(300) NOT NULL,
    road_address VARCHAR(300),
    phone VARCHAR(20),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    region_id VARCHAR(50) NOT NULL,

    -- AI 큐레이션 정보
    date_score INTEGER,
    mood_tags TEXT,
    price_range VARCHAR(50),
    best_time VARCHAR(50),
    recommendation TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_places_region FOREIGN KEY (region_id) REFERENCES regions(id)
);
```

## API 엔드포인트

### 관리자 API (`/api/admin/places`)

#### 1. 특정 지역 데이터 수집
```bash
POST /api/admin/places/collect/{regionId}
```

**예시:**
```bash
curl -X POST http://localhost:8080/api/admin/places/collect/mapo-hongdae
```

**응답:**
```json
{
  "regionId": "mapo-hongdae",
  "collectedCount": 45,
  "message": "데이터 수집 완료"
}
```

#### 2. 전체 지역 데이터 수집
```bash
POST /api/admin/places/collect-all
```

**예시:**
```bash
curl -X POST http://localhost:8080/api/admin/places/collect-all
```

**응답:**
```json
{
  "totalCount": 540,
  "results": {
    "jongno-gwanghwamun": 45,
    "mapo-hongdae": 45,
    "seongdong-seongsu": 45,
    ...
  },
  "message": "전체 지역 데이터 수집 완료"
}
```

#### 3. 기존 장소 큐레이션 업데이트
```bash
POST /api/admin/places/update-curation
```

**예시:**
```bash
curl -X POST http://localhost:8080/api/admin/places/update-curation
```

#### 4. 수집 가능한 지역 목록 조회
```bash
GET /api/admin/places/regions
```

**응답:**
```json
{
  "regions": [
    "jongno-gwanghwamun",
    "mapo-hongdae",
    "seongdong-seongsu",
    ...
  ],
  "categories": ["CE7", "FD6", "CT1", "AT4"],
  "searchRadius": 2000
}
```

## 서울 12개 지역

| 지역 ID | 지역명 | 중심 좌표 (위도, 경도) |
|---------|--------|---------------------|
| jongno-gwanghwamun | 종로·광화문 | 37.5720, 126.9769 |
| mapo-hongdae | 마포·홍대 | 37.5563, 126.9239 |
| seongdong-seongsu | 성동·성수 | 37.5443, 127.0557 |
| yeongdeungpo-yeouido | 영등포·여의도 | 37.5219, 126.9245 |
| seongbuk-hyehwa | 성북·혜화 | 37.5892, 127.0019 |
| yongsan-itaewon | 용산·이태원 | 37.5347, 126.9946 |
| gwangjin-kondae | 광진·건대 | 37.5408, 127.0698 |
| seocho-gyodae | 서초·교대 | 37.4933, 127.0145 |
| junggu-myeongdong | 중구·명동 | 37.5636, 126.9850 |
| gangnam-yeoksam | 강남·역삼 | 37.5008, 127.0365 |
| songpa-jamsil | 송파·잠실 | 37.5133, 127.1028 |
| gangdong-cheonho | 강동·천호 | 37.5304, 127.1237 |

## 수집 카테고리

| 코드 | 카테고리명 |
|------|-----------|
| CE7 | 카페 |
| FD6 | 음식점 |
| CT1 | 문화시설 |
| AT4 | 관광명소 |

## 환경 변수 설정

`.env` 파일 또는 환경 변수에 다음 값을 설정하세요:

```properties
# Kakao REST API Key
KAKAO_REST_API_KEY=your_kakao_api_key_here

# Claude API Key (Anthropic)
CLAUDE_API_KEY=your_claude_api_key_here
```

현재 `application.yml`에 하드코딩된 Kakao API 키:
```
0ac2b0019712853b21e9b5f326fa064d
```

## 구현 상세

### 주요 클래스

#### 1. Entity
- `Place`: 장소 엔티티 (기본 정보 + AI 큐레이션 정보)

#### 2. Repository
- `PlaceRepository`: 장소 데이터 CRUD 및 쿼리

#### 3. DTO
- `KakaoPlaceDto`: Kakao Local API 응답 구조
- `PlaceCurationDto`: Claude API 요청/응답 및 큐레이션 결과

#### 4. Service
- `KakaoLocalApiService`: Kakao Local API 클라이언트
- `PlaceCurationService`: Claude AI 큐레이션 서비스
- `PlaceCollectionService`: 데이터 수집 및 저장 orchestration

#### 5. Controller
- `PlaceCollectionController`: 관리자용 데이터 수집 API

### 데이터 수집 플로우

```
1. PlaceCollectionController
   ↓
2. PlaceCollectionService.collectPlacesForRegion()
   ↓
3. For each category:
   ↓
4. KakaoLocalApiService.searchPlacesByCategory()
   → Kakao API 호출
   ↓
5. For each place:
   ↓
6. 중복 체크 (PlaceRepository.existsByKakaoPlaceId)
   ↓
7. 데이터 검증 (validatePlaceData)
   ↓
8. PlaceCurationService.curatePlaceInfo()
   → Claude API 호출 (AI 분석)
   ↓
9. Place 엔티티 생성 및 저장
   ↓
10. PlaceRepository.save()
```

### API 호출 제한 고려

#### Kakao API
- 카테고리 간 딜레이: 1초
- 페이지 최대: 3페이지 (45개 장소)

#### Claude API
- 장소당 딜레이: 0.5초
- 지역 간 딜레이: 2초

### 에러 처리

- API 호출 실패 시 로그 기록 후 다음 장소로 진행
- 중복 데이터 자동 스킵
- 유효하지 않은 데이터 필터링

## 예상 데이터 수집량

- **지역당**: 약 45개 장소 (카테고리당 최대 15개 × 3페이지)
- **전체**: 약 540개 장소 (12개 지역 × 45개)
- **실제 저장량**: 중복 제거 후 400~500개 예상

## 사용 방법

### 1. 데이터베이스 준비
```bash
# Docker Compose로 PostgreSQL 실행
docker-compose up -d postgres
```

### 2. 애플리케이션 실행
```bash
cd backend
./gradlew bootRun
```

### 3. Swagger UI 접속
```
http://localhost:8080/api/swagger-ui.html
```

### 4. 데이터 수집 시작

**옵션 A: 특정 지역만 수집**
```bash
curl -X POST http://localhost:8080/api/admin/places/collect/mapo-hongdae
```

**옵션 B: 전체 지역 수집 (권장)**
```bash
curl -X POST http://localhost:8080/api/admin/places/collect-all
```

### 5. 수집 결과 확인
```sql
-- 수집된 장소 개수 확인
SELECT region_id, COUNT(*) as count
FROM places
GROUP BY region_id
ORDER BY count DESC;

-- 데이트 점수 상위 10개 장소
SELECT name, category, date_score, recommendation
FROM places
WHERE date_score IS NOT NULL
ORDER BY date_score DESC
LIMIT 10;
```

## 주의사항

1. **API 키 관리**: API 키를 Git에 커밋하지 않도록 주의
2. **비용**: Claude API 호출 비용 발생 (장소당 약 0.001~0.01 USD)
3. **시간**: 전체 지역 수집 시 약 10~20분 소요
4. **Rate Limit**: API 호출 제한을 준수하여 딜레이 적용

## 문제 해결

### Claude API 키가 없는 경우
- 큐레이션 없이 기본 장소 정보만 수집됨
- 나중에 `/update-curation` 엔드포인트로 일괄 업데이트 가능

### Kakao API 호출 실패
- API 키 확인
- 네트워크 연결 확인
- 로그에서 에러 메시지 확인

## 향후 개선 사항

- [ ] 비동기 처리 (Spring Async)
- [ ] 진행 상황 모니터링 (WebSocket)
- [ ] 수집 이력 관리
- [ ] 장소 정보 주기적 업데이트
- [ ] 더 많은 카테고리 추가
- [ ] 실시간 운영 시간 정보 수집
