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
