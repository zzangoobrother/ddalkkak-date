package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.CourseResponse;
import com.ddalkkak.date.dto.DateType;
import com.ddalkkak.date.dto.PlaceInCourseDto;
import com.ddalkkak.date.entity.Place;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Fallback 템플릿 서비스
 * LLM 실패 시 사전 제작된 코스 템플릿 반환
 */
@Slf4j
@Service
public class FallbackTemplateService {

    private TemplateData templateData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        loadTemplates();
    }

    /**
     * fallback-templates.json 파일 로드
     */
    private void loadTemplates() {
        try {
            ClassPathResource resource = new ClassPathResource("fallback-templates.json");
            templateData = objectMapper.readValue(resource.getInputStream(), TemplateData.class);
            log.info("Fallback 템플릿 로드 완료: {} 개", templateData.getTemplates().size());
        } catch (IOException e) {
            log.error("Fallback 템플릿 로드 실패: {}", e.getMessage(), e);
            // 빈 템플릿 데이터 초기화
            templateData = new TemplateData();
            templateData.setTemplates(List.of());
        }
    }

    /**
     * 사전 제작 코스 조회
     *
     * @param regionId 지역 ID
     * @param dateTypeId 데이트 유형 ID
     * @param candidatePlaces 후보 장소 목록
     * @return 템플릿 기반 코스 응답
     */
    public CourseResponse getPrebuiltCourse(
            String regionId,
            String dateTypeId,
            List<Place> candidatePlaces
    ) {
        log.info("Fallback 템플릿 조회 - 지역: {}, 데이트 유형: {}", regionId, dateTypeId);

        // 1. 템플릿 조회
        CourseTemplate template = findTemplate(regionId, dateTypeId);

        if (template == null) {
            log.warn("일치하는 템플릿이 없음. 기본 템플릿 사용");
            template = getDefaultTemplate();
        }

        // 2. 후보 장소에서 템플릿 장소 개수만큼 선택
        List<Place> selectedPlaces = selectPlacesForTemplate(candidatePlaces, template.getPlaces().size());

        // 3. 템플릿을 실제 장소와 매핑하여 CourseResponse 생성
        return mapTemplateToResponse(template, selectedPlaces, regionId, dateTypeId);
    }

    /**
     * 템플릿 조회
     */
    private CourseTemplate findTemplate(String regionId, String dateTypeId) {
        return templateData.getTemplates().stream()
                .filter(t -> t.getRegionId().equals(regionId) && t.getDateTypeId().equals(dateTypeId))
                .findFirst()
                .orElse(null);
    }

    /**
     * 기본 템플릿 반환 (템플릿이 없을 경우)
     */
    private CourseTemplate getDefaultTemplate() {
        CourseTemplate template = new CourseTemplate();
        template.setCourseName("추천 데이트 코스");
        template.setDescription("선택하신 지역과 예산에 맞는 데이트 코스입니다.");
        template.setTotalDurationMinutes(180);
        template.setTotalBudget(60000);

        // 기본 2개 장소
        PlaceTemplate place1 = new PlaceTemplate();
        place1.setSequence(1);
        place1.setDurationMinutes(90);
        place1.setEstimatedCost(30000);
        place1.setRecommendedMenu("추천 메뉴");
        place1.setRecommendationReason("분위기 좋은 장소");
        place1.setTransportToNext("도보 5분");

        PlaceTemplate place2 = new PlaceTemplate();
        place2.setSequence(2);
        place2.setDurationMinutes(90);
        place2.setEstimatedCost(30000);
        place2.setRecommendedMenu("추천 메뉴");
        place2.setRecommendationReason("여유롭게 즐기기 좋은 장소");
        place2.setTransportToNext(null);

        template.setPlaces(List.of(place1, place2));
        return template;
    }

    /**
     * 후보 장소에서 필요한 개수만큼 선택
     */
    private List<Place> selectPlacesForTemplate(List<Place> candidatePlaces, int count) {
        if (candidatePlaces.isEmpty()) {
            log.warn("후보 장소가 없음");
            return List.of();
        }

        // 상위 count개 선택 (후보 장소는 이미 dateScore 순으로 정렬되어 있음)
        return candidatePlaces.stream()
                .limit(Math.min(count, candidatePlaces.size()))
                .collect(Collectors.toList());
    }

    /**
     * 템플릿을 실제 장소와 매핑하여 CourseResponse 생성
     */
    private CourseResponse mapTemplateToResponse(
            CourseTemplate template,
            List<Place> selectedPlaces,
            String regionId,
            String dateTypeId
    ) {
        String courseId = "course-" + UUID.randomUUID().toString().substring(0, 8);

        // 템플릿 장소와 실제 장소 매핑
        List<PlaceInCourseDto> places = template.getPlaces().stream()
                .map(templatePlace -> {
                    // 순서에 맞는 실제 장소 선택
                    int index = templatePlace.getSequence() - 1;
                    if (index >= selectedPlaces.size()) {
                        log.warn("템플릿 장소 개수가 실제 장소 개수보다 많음");
                        return null;
                    }

                    Place place = selectedPlaces.get(index);

                    return PlaceInCourseDto.builder()
                            .placeId(place.getId())
                            .name(place.getName())
                            .category(place.getCategory())
                            .address(place.getAddress())
                            .latitude(place.getLatitude())
                            .longitude(place.getLongitude())
                            .durationMinutes(templatePlace.getDurationMinutes())
                            .estimatedCost(templatePlace.getEstimatedCost())
                            .recommendedMenu(templatePlace.getRecommendedMenu())
                            .sequence(templatePlace.getSequence())
                            .transportToNext(templatePlace.getTransportToNext())
                            .imageUrls(generatePlaceImageUrls(place.getCategory()))
                            .openingHours(null) // TODO: 추후 확장
                            .needsReservation(null) // TODO: 추후 확장
                            .rating(place.getRating())
                            .reviewCount(place.getReviewCount())
                            .build();
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());

        // DateType 조회
        DateType dateType = DateType.fromId(dateTypeId);

        return CourseResponse.builder()
                .courseId(courseId)
                .courseName(template.getCourseName())
                .regionId(regionId)
                .regionName("") // Region 정보가 없어서 빈 문자열 (CourseService에서 채워줌)
                .dateTypeId(dateTypeId)
                .dateTypeName(dateType.getName())
                .totalDurationMinutes(template.getTotalDurationMinutes())
                .totalBudget(template.getTotalBudget())
                .description(template.getDescription())
                .places(places)
                .createdAt(System.currentTimeMillis())
                .build();
    }

    /**
     * 장소 카테고리에 따른 기본 이미지 URL 생성 (최대 3장)
     */
    private List<String> generatePlaceImageUrls(String category) {
        List<String> imageUrls = new ArrayList<>();

        // 카테고리에 따른 Unsplash 이미지 (임시)
        String query = extractImageQuery(category);

        // 최대 3장의 이미지 URL 생성
        for (int i = 1; i <= 3; i++) {
            imageUrls.add(String.format("https://source.unsplash.com/800x600/?%s&sig=%d", query, i));
        }

        return imageUrls;
    }

    /**
     * 카테고리에서 이미지 검색 쿼리 추출
     */
    private String extractImageQuery(String category) {
        if (category == null) {
            return "restaurant,cafe,seoul";
        }

        String lowerCategory = category.toLowerCase();

        // 카테고리별 이미지 쿼리 매핑
        if (lowerCategory.contains("카페") || lowerCategory.contains("커피")) {
            return "cafe,coffee,dessert";
        } else if (lowerCategory.contains("음식점") || lowerCategory.contains("레스토랑")) {
            return "restaurant,food,dining";
        } else if (lowerCategory.contains("한식")) {
            return "korean,food,restaurant";
        } else if (lowerCategory.contains("양식") || lowerCategory.contains("이탈리안")) {
            return "italian,pasta,restaurant";
        } else if (lowerCategory.contains("일식")) {
            return "japanese,sushi,restaurant";
        } else if (lowerCategory.contains("중식")) {
            return "chinese,food,restaurant";
        } else if (lowerCategory.contains("바") || lowerCategory.contains("펍")) {
            return "bar,pub,drinks";
        } else if (lowerCategory.contains("갤러리") || lowerCategory.contains("박물관")) {
            return "gallery,museum,art";
        } else if (lowerCategory.contains("공원") || lowerCategory.contains("야경")) {
            return "park,night,view,seoul";
        } else {
            return "restaurant,cafe,seoul";
        }
    }

    // ===== DTO 클래스 =====

    /**
     * 템플릿 데이터 전체 구조
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemplateData {
        private List<CourseTemplate> templates;

        public void setTemplates(List<CourseTemplate> templates) {
            this.templates = templates;
        }
    }

    /**
     * 코스 템플릿
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseTemplate {
        @JsonProperty("regionId")
        private String regionId;

        @JsonProperty("dateTypeId")
        private String dateTypeId;

        @JsonProperty("courseName")
        private String courseName;

        @JsonProperty("description")
        private String description;

        @JsonProperty("totalDurationMinutes")
        private Integer totalDurationMinutes;

        @JsonProperty("totalBudget")
        private Integer totalBudget;

        @JsonProperty("places")
        private List<PlaceTemplate> places;

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setTotalDurationMinutes(Integer totalDurationMinutes) {
            this.totalDurationMinutes = totalDurationMinutes;
        }

        public void setTotalBudget(Integer totalBudget) {
            this.totalBudget = totalBudget;
        }

        public void setPlaces(List<PlaceTemplate> places) {
            this.places = places;
        }
    }

    /**
     * 장소 템플릿
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaceTemplate {
        @JsonProperty("sequence")
        private Integer sequence;

        @JsonProperty("durationMinutes")
        private Integer durationMinutes;

        @JsonProperty("estimatedCost")
        private Integer estimatedCost;

        @JsonProperty("recommendedMenu")
        private String recommendedMenu;

        @JsonProperty("recommendationReason")
        private String recommendationReason;

        @JsonProperty("transportToNext")
        private String transportToNext;

        public void setSequence(Integer sequence) {
            this.sequence = sequence;
        }

        public void setDurationMinutes(Integer durationMinutes) {
            this.durationMinutes = durationMinutes;
        }

        public void setEstimatedCost(Integer estimatedCost) {
            this.estimatedCost = estimatedCost;
        }

        public void setRecommendedMenu(String recommendedMenu) {
            this.recommendedMenu = recommendedMenu;
        }

        public void setRecommendationReason(String recommendationReason) {
            this.recommendationReason = recommendationReason;
        }

        public void setTransportToNext(String transportToNext) {
            this.transportToNext = transportToNext;
        }
    }
}
