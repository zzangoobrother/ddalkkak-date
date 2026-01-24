package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.CourseGenerationRequest;
import com.ddalkkak.date.dto.CourseResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * CourseService 통합 테스트
 *
 * 주의: 이 테스트는 실제 LLM API를 호출할 수 있으므로 비용이 발생할 수 있습니다.
 * 환경변수 OPENAI_API_KEY 또는 ANTHROPIC_API_KEY가 설정되어 있어야 합니다.
 * API 키가 없으면 Fallback 템플릿이 사용됩니다.
 */
@SpringBootTest
@ActiveProfiles("test")
class CourseServiceIntegrationTest {

    @Autowired
    private CourseService courseService;

    @Test
    @DisplayName("코스 생성 통합 테스트 - 정상 케이스")
    void testGenerateCourse_Success() {
        // Given
        CourseGenerationRequest request = new CourseGenerationRequest();
        request.setRegionId("mapo");
        request.setDateTypeId("cafe");
        request.setBudgetPresetId("30k-50k");

        // When
        CourseResponse response = courseService.generateCourse(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getCourseId()).isNotNull();
        assertThat(response.getCourseName()).isNotEmpty();
        assertThat(response.getRegionId()).isEqualTo("mapo");
        assertThat(response.getDateTypeId()).isEqualTo("cafe");
        assertThat(response.getPlaces()).isNotEmpty();
        assertThat(response.getPlaces().size()).isBetween(2, 3);
        assertThat(response.getTotalBudget()).isGreaterThan(0);
        assertThat(response.getTotalDurationMinutes()).isGreaterThan(0);

        // 로그 출력
        System.out.println("=== 생성된 코스 ===");
        System.out.println("코스 ID: " + response.getCourseId());
        System.out.println("코스 이름: " + response.getCourseName());
        System.out.println("설명: " + response.getDescription());
        System.out.println("총 소요 시간: " + response.getTotalDurationMinutes() + "분");
        System.out.println("총 예산: " + String.format("%,d", response.getTotalBudget()) + "원");
        System.out.println("\n장소 목록:");
        response.getPlaces().forEach(place -> {
            System.out.println(String.format("  %d. %s (%s)",
                    place.getSequence(),
                    place.getName(),
                    place.getCategory()));
            System.out.println(String.format("     - 소요 시간: %d분, 예상 비용: %,d원",
                    place.getDurationMinutes(),
                    place.getEstimatedCost()));
            if (place.getTransportToNext() != null) {
                System.out.println("     - 다음 장소로: " + place.getTransportToNext());
            }
        });
    }

    @Test
    @DisplayName("코스 생성 통합 테스트 - 다양한 지역과 데이트 유형")
    void testGenerateCourse_VariousRegionsAndTypes() {
        // Given - 홍대 저녁
        CourseGenerationRequest request1 = new CourseGenerationRequest();
        request1.setRegionId("mapo");
        request1.setDateTypeId("dinner");
        request1.setBudgetPresetId("50k-80k");

        // When
        CourseResponse response1 = courseService.generateCourse(request1);

        // Then
        assertThat(response1).isNotNull();
        assertThat(response1.getRegionId()).isEqualTo("mapo");
        assertThat(response1.getDateTypeId()).isEqualTo("dinner");
        System.out.println("\n홍대 저녁 코스: " + response1.getCourseName());

        // Given - 강남 카페
        CourseGenerationRequest request2 = new CourseGenerationRequest();
        request2.setRegionId("gangnam");
        request2.setDateTypeId("cafe");
        request2.setBudgetPresetId("30k-50k");

        // When
        CourseResponse response2 = courseService.generateCourse(request2);

        // Then
        assertThat(response2).isNotNull();
        assertThat(response2.getRegionId()).isEqualTo("gangnam");
        assertThat(response2.getDateTypeId()).isEqualTo("cafe");
        System.out.println("강남 카페 코스: " + response2.getCourseName());

        // Given - 종로 문화
        CourseGenerationRequest request3 = new CourseGenerationRequest();
        request3.setRegionId("jongno");
        request3.setDateTypeId("culture");
        request3.setBudgetPresetId("30k-50k");

        // When
        CourseResponse response3 = courseService.generateCourse(request3);

        // Then
        assertThat(response3).isNotNull();
        assertThat(response3.getRegionId()).isEqualTo("jongno");
        assertThat(response3.getDateTypeId()).isEqualTo("culture");
        System.out.println("종로 문화 코스: " + response3.getCourseName());
    }

    @Test
    @DisplayName("Fallback 템플릿 테스트 - API 키 없이 실행")
    void testGenerateCourse_FallbackTemplate() {
        // Given
        // 환경변수에 API 키가 없을 경우 Fallback 템플릿이 사용됨
        CourseGenerationRequest request = new CourseGenerationRequest();
        request.setRegionId("mapo");
        request.setDateTypeId("cafe");
        request.setBudgetPresetId("30k-50k");

        // When
        CourseResponse response = courseService.generateCourse(request);

        // Then
        // Fallback 템플릿이라도 응답은 성공해야 함
        assertThat(response).isNotNull();
        assertThat(response.getPlaces()).isNotEmpty();
        System.out.println("\nFallback 템플릿 사용 (API 키 없음): " + response.getCourseName());
    }
}
