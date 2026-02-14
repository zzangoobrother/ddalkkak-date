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
    rating DOUBLE PRECISION,
    review_count INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_places_region FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 장소 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_places_region_id ON places(region_id);
CREATE INDEX IF NOT EXISTS idx_places_kakao_place_id ON places(kakao_place_id);
CREATE INDEX IF NOT EXISTS idx_places_date_score ON places(date_score);

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    kakao_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255),
    nickname VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    CONSTRAINT uk_users_kakao_id UNIQUE (kakao_id)
);

-- 사용자 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_kakao_id ON users(kakao_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);

-- 약관 테이블
CREATE TABLE IF NOT EXISTS terms (
    id BIGSERIAL PRIMARY KEY,
    term_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    required BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_term_type CHECK (term_type IN ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'MARKETING'))
);

-- 약관 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_term_type ON terms(term_type);
CREATE INDEX IF NOT EXISTS idx_term_version ON terms(version);

-- 약관 동의 테이블
CREATE TABLE IF NOT EXISTS term_agreements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    term_id BIGINT NOT NULL,
    agreed BOOLEAN NOT NULL,
    agreed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_term_agreements_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_term_agreements_term FOREIGN KEY (term_id) REFERENCES terms(id)
);

-- 약관 동의 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_term_agreement_user_id ON term_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_term_agreement_term_id ON term_agreements(term_id);

-- 코스 테이블
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL UNIQUE,
    share_id VARCHAR(50) UNIQUE,  -- 공유용 고유 ID (SCRUM-33)
    course_name VARCHAR(200) NOT NULL,
    region_id VARCHAR(50) NOT NULL,
    date_type_id VARCHAR(50) NOT NULL,
    total_duration_minutes INTEGER,
    total_budget INTEGER,
    description TEXT,
    user_id VARCHAR(100),  -- 추후 users 테이블과 FK 연결 예정 (BIGINT로 변경)
    status VARCHAR(20),
    confirmed_at TIMESTAMP,
    rating DOUBLE PRECISION,  -- 코스 평가 점수 (1.0 ~ 5.0) (SCRUM-11)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_region FOREIGN KEY (region_id) REFERENCES regions(id),
    CONSTRAINT chk_course_status CHECK (status IN ('DRAFT', 'SAVED', 'CONFIRMED'))
);

-- 코스 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_course_id ON courses(course_id);
CREATE INDEX IF NOT EXISTS idx_share_id ON courses(share_id);  -- 공유 ID 인덱스 (SCRUM-33)
CREATE INDEX IF NOT EXISTS idx_region_id ON courses(region_id);
CREATE INDEX IF NOT EXISTS idx_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON courses(created_at);

-- 코스-장소 연관 테이블
CREATE TABLE IF NOT EXISTS course_places (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    sequence INTEGER NOT NULL,
    duration_minutes INTEGER,
    estimated_cost INTEGER,
    recommended_menu TEXT,
    transport_to_next VARCHAR(100),
    CONSTRAINT fk_course_places_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_places_place FOREIGN KEY (place_id) REFERENCES places(id)
);

-- 코스-장소 연관 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_course_place_course_id ON course_places(course_id);
CREATE INDEX IF NOT EXISTS idx_course_place_place_id ON course_places(place_id);

-- 피드백 테이블 (SCRUM-35)
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    overall_rating INTEGER NOT NULL,
    positive_options VARCHAR(500),
    negative_options VARCHAR(500),
    free_text VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedbacks_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_feedback_course_user UNIQUE (course_id, user_id),
    CONSTRAINT chk_overall_rating CHECK (overall_rating >= 1 AND overall_rating <= 5)
);

-- 피드백 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_feedback_course_id ON feedbacks(course_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedbacks(user_id);

-- 장소별 평가 테이블 (SCRUM-35)
CREATE TABLE IF NOT EXISTS feedback_place_ratings (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    recommendation VARCHAR(20) NOT NULL,
    CONSTRAINT fk_fpr_feedback FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    CONSTRAINT chk_recommendation CHECK (recommendation IN ('RECOMMEND', 'NOT_RECOMMEND'))
);

-- 장소별 평가 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_fpr_feedback_id ON feedback_place_ratings(feedback_id);
CREATE INDEX IF NOT EXISTS idx_fpr_place_id ON feedback_place_ratings(place_id);
