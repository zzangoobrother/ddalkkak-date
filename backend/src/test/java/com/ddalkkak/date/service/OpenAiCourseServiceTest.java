package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.CoursePromptContext;
import com.ddalkkak.date.dto.DateType;
import com.ddalkkak.date.dto.LlmCourseGenerationDto;
import com.ddalkkak.date.entity.Place;
import com.ddalkkak.date.entity.Region;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * OpenAiCourseService 단위 테스트
 */
class OpenAiCourseServiceTest {

    private OpenAiCourseService openAiCourseService;

    @BeforeEach
    void setUp() {
        // 테스트용 OpenAiCourseService 생성
        // 실제 API 키가 없으면 테스트 스킵 (환경변수 확인)
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = "test-api-key"; // Mock API 키
        }

        openAiCourseService = new OpenAiCourseService(
                apiKey,
                "https://api.openai.com/v1",
                "gpt-4-turbo-preview",
                10
        );
    }

    @Test
    @DisplayName("프롬프트 컨텍스트 생성 테스트")
    void testBuildCoursePromptContext() {
        // Given
        Region region = Region.builder()
                .id("mapo")
                .name("마포·홍대")
                .build();

        DateType dateType = DateType.CAFE;

        List<Place> candidatePlaces = List.of(
                Place.builder()
                        .id("place1")
                        .name("테스트 카페 1")
                        .category("카페")
                        .rating(4.5)
                        .reviewCount(100)
                        .priceRange("10,000-20,000원")
                        .address("서울 마포구")
                        .latitude(37.5665)
                        .longitude(126.9780)
                        .build(),
                Place.builder()
                        .id("place2")
                        .name("테스트 카페 2")
                        .category("카페")
                        .rating(4.3)
                        .reviewCount(80)
                        .priceRange("15,000-25,000원")
                        .address("서울 마포구")
                        .latitude(37.5660)
                        .longitude(126.9770)
                        .build()
        );

        // When
        CoursePromptContext context = CoursePromptContext.builder()
                .region(region)
                .dateType(dateType)
                .minBudget(30000)
                .maxBudget(50000)
                .candidatePlaces(candidatePlaces)
                .build();

        // Then
        assertThat(context).isNotNull();
        assertThat(context.getRegion().getName()).isEqualTo("마포·홍대");
        assertThat(context.getDateType()).isEqualTo(DateType.CAFE);
        assertThat(context.getCandidatePlaces()).hasSize(2);
    }

    @Test
    @DisplayName("LLM 응답 DTO 생성 테스트")
    void testLlmCourseGenerationDto() {
        // Given
        LlmCourseGenerationDto.PlaceInCourse place1 = new LlmCourseGenerationDto.PlaceInCourse(
                "place1",
                1,
                60,
                15000,
                "아메리카노",
                "분위기 좋은 카페",
                "도보 5분"
        );

        LlmCourseGenerationDto.PlaceInCourse place2 = new LlmCourseGenerationDto.PlaceInCourse(
                "place2",
                2,
                90,
                20000,
                "브런치 세트",
                "맛있는 브런치",
                null
        );

        // When
        LlmCourseGenerationDto.CourseGenerationResult result =
                new LlmCourseGenerationDto.CourseGenerationResult(
                        "홍대 카페 투어",
                        "감성 가득한 홍대 카페 코스",
                        150,
                        35000,
                        List.of(place1, place2)
                );

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCourseName()).isEqualTo("홍대 카페 투어");
        assertThat(result.getPlaces()).hasSize(2);
        assertThat(result.getTotalDurationMinutes()).isEqualTo(150);
        assertThat(result.getTotalBudget()).isEqualTo(35000);
    }

    // 주의: 아래 테스트는 실제 OpenAI API 키가 필요합니다
    // 환경변수 OPENAI_API_KEY가 설정되어 있어야 합니다
    // 테스트 실행 시 비용이 발생할 수 있으므로 주의하세요

    // @Test
    // @DisplayName("OpenAI API 실제 호출 테스트 (통합 테스트)")
    // void testGenerateCourseWithRealApi() {
    //     // Given
    //     String apiKey = System.getenv("OPENAI_API_KEY");
    //     if (apiKey == null || apiKey.isEmpty()) {
    //         System.out.println("OPENAI_API_KEY 환경변수가 설정되지 않아 테스트를 스킵합니다.");
    //         return;
    //     }
    //
    //     Region region = Region.builder()
    //             .id("mapo")
    //             .name("마포·홍대")
    //             .build();
    //
    //     DateType dateType = DateType.CAFE;
    //
    //     List<Place> candidatePlaces = List.of(
    //             Place.builder()
    //                     .id("place1")
    //                     .name("연남동 감성 카페")
    //                     .category("카페")
    //                     .rating(4.5)
    //                     .reviewCount(150)
    //                     .priceRange("10,000-20,000원")
    //                     .address("서울 마포구 연남동")
    //                     .latitude(37.5665)
    //                     .longitude(126.9780)
    //                     .build(),
    //             Place.builder()
    //                     .id("place2")
    //                     .name("홍대 루프탑 카페")
    //                     .category("카페")
    //                     .rating(4.7)
    //                     .reviewCount(200)
    //                     .priceRange("15,000-25,000원")
    //                     .address("서울 마포구 홍대입구")
    //                     .latitude(37.5660)
    //                     .longitude(126.9770)
    //                     .build()
    //     );
    //
    //     CoursePromptContext context = CoursePromptContext.builder()
    //             .region(region)
    //             .dateType(dateType)
    //             .minBudget(30000)
    //             .maxBudget(50000)
    //             .candidatePlaces(candidatePlaces)
    //             .build();
    //
    //     // When
    //     LlmCourseGenerationDto.CourseGenerationResult result =
    //             openAiCourseService.generateCourse(context);
    //
    //     // Then
    //     assertThat(result).isNotNull();
    //     assertThat(result.getPlaces()).isNotEmpty();
    //     assertThat(result.getPlaces().size()).isBetween(2, 3);
    //     System.out.println("생성된 코스: " + result.getCourseName());
    //     System.out.println("설명: " + result.getDescription());
    // }
}
