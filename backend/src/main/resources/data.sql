-- 서울 12개 지역 초기 데이터 (3x4 그리드)
-- 1열: 종로·광화문, 마포·홍대, 성동·성수, 영등포·여의도
-- 2열: 성북·혜화, 용산·이태원, 광진·건대, 서초·교대
-- 3열: 중구·명동, 강남·역삼, 송파·잠실, 강동·천호

INSERT INTO regions (id, name, emoji, tagline, grid_row, grid_col, display_order) VALUES
('jongno-gwanghwamun', '종로·광화문', '🏛️', '역사와 문화의 중심', 0, 0, 1),
('mapo-hongdae', '마포·홍대', '🎨', '예술과 청춘의 거리', 1, 0, 2),
('seongdong-seongsu', '성동·성수', '🏭', '힙한 감성의 성지', 2, 0, 3),
('yeongdeungpo-yeouido', '영등포·여의도', '🏙️', '한강과 도심의 조화', 3, 0, 4),
('seongbuk-hyehwa', '성북·혜화', '🌳', '문화와 자연의 공존', 0, 1, 5),
('yongsan-itaewon', '용산·이태원', '🗼', '글로벌 문화의 거리', 1, 1, 6),
('gwangjin-kondae', '광진·건대', '🎓', '젊음과 활력의 중심', 2, 1, 7),
('seocho-gyodae', '서초·교대', '🌸', '여유로운 도심 속 힐링', 3, 1, 8),
('junggu-myeongdong', '중구·명동', '🏢', '쇼핑과 맛집의 천국', 0, 2, 9),
('gangnam-yeoksam', '강남·역삼', '💼', '트렌디한 라이프스타일', 1, 2, 10),
('songpa-jamsil', '송파·잠실', '🎢', '놀이와 휴식의 공간', 2, 2, 11),
('gangdong-cheonho', '강동·천호', '🌊', '한강과 함께하는 여유', 3, 2, 12)
ON CONFLICT (id) DO NOTHING;
