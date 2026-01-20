-- 지역 테이블
CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    tagline VARCHAR(200) NOT NULL,
    grid_row INTEGER NOT NULL,
    grid_col INTEGER NOT NULL,
    display_order INTEGER NOT NULL
);

-- 방문 기록 테이블
CREATE TABLE IF NOT EXISTS visits (
    id BIGSERIAL PRIMARY KEY,
    region_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_visits_region FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_region_id_created_at ON visits(region_id, created_at);

-- 장소 테이블
CREATE TABLE IF NOT EXISTS places (
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
    date_score INTEGER,
    mood_tags TEXT,
    price_range VARCHAR(50),
    best_time VARCHAR(50),
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_places_region FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 장소 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_places_region_id ON places(region_id);
CREATE INDEX IF NOT EXISTS idx_places_kakao_place_id ON places(kakao_place_id);
CREATE INDEX IF NOT EXISTS idx_places_date_score ON places(date_score);
