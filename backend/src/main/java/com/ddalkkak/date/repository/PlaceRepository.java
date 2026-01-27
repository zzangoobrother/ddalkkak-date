package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 장소 Repository
 */
@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    /**
     * 카카오 장소 ID로 장소 조회
     */
    Optional<Place> findByKakaoPlaceId(String kakaoPlaceId);

    /**
     * 지역 ID로 장소 목록 조회
     */
    List<Place> findByRegionId(String regionId);

    /**
     * 지역 ID로 장소 페이징 조회
     */
    Page<Place> findByRegionId(String regionId, Pageable pageable);

    /**
     * 지역 ID와 데이트 점수 기준으로 장소 목록 조회
     */
    List<Place> findByRegionIdAndDateScoreGreaterThanEqual(String regionId, Integer minDateScore);

    /**
     * 카카오 장소 ID 존재 여부 확인
     */
    boolean existsByKakaoPlaceId(String kakaoPlaceId);

    /**
     * 검색어로 장소 검색 (이름, 카테고리, 주소 포함)
     */
    @Query("SELECT p FROM Place p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Place> searchByQuery(@Param("query") String query, Pageable pageable);

    /**
     * 검색어 + 지역 ID로 장소 검색
     */
    @Query("SELECT p FROM Place p WHERE " +
            "p.regionId = :regionId AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Place> searchByQueryAndRegion(@Param("query") String query,
                                        @Param("regionId") String regionId,
                                        Pageable pageable);

    /**
     * 유사 장소 검색 (같은 카테고리, 같은 지역, 자기 자신 제외)
     */
    @Query("SELECT p FROM Place p WHERE " +
            "p.category = :category AND " +
            "p.regionId = :regionId AND " +
            "p.id != :excludePlaceId")
    List<Place> findSimilarPlaces(@Param("category") String category,
                                   @Param("regionId") String regionId,
                                   @Param("excludePlaceId") Long excludePlaceId,
                                   Pageable pageable);
}
