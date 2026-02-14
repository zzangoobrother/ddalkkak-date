package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.FeedbackRequest;
import com.ddalkkak.date.dto.FeedbackResponse;
import com.ddalkkak.date.dto.FeedbackStatsResponse;
import com.ddalkkak.date.entity.Course;
import com.ddalkkak.date.entity.CourseStatus;
import com.ddalkkak.date.entity.Feedback;
import com.ddalkkak.date.entity.FeedbackPlaceRating;
import com.ddalkkak.date.repository.CourseRepository;
import com.ddalkkak.date.repository.FeedbackPlaceRatingRepository;
import com.ddalkkak.date.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 피드백 서비스
 * 피드백 제출, 조회, 통계 관련 비즈니스 로직
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackPlaceRatingRepository feedbackPlaceRatingRepository;
    private final CourseRepository courseRepository;

    /**
     * 피드백 제출
     * 코스에 대한 사용자 피드백을 저장하고 코스 평점을 업데이트
     */
    @Transactional
    public FeedbackResponse submitFeedback(String courseId, String userId, FeedbackRequest request) {
        log.info("피드백 제출 시작 - 코스: {}, 사용자: {}", courseId, userId);

        // 코스 조회
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("코스를 찾을 수 없음: " + courseId));

        // 권한 체크: 본인의 코스만 피드백 가능
        if (course.getUserId() == null || !course.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 코스만 피드백할 수 있습니다.");
        }

        // 상태 체크: 확정된 코스만 피드백 가능
        if (course.getStatus() != CourseStatus.CONFIRMED) {
            throw new IllegalArgumentException("확정된 코스만 피드백할 수 있습니다.");
        }

        // 중복 체크
        if (feedbackRepository.findByCourse_IdAndUserId(course.getId(), userId).isPresent()) {
            throw new IllegalStateException("이미 피드백을 제출한 코스입니다.");
        }

        // 피드백 엔티티 생성
        Feedback feedback = Feedback.builder()
                .course(course)
                .userId(userId)
                .overallRating(request.getOverallRating())
                .positiveOptions(joinOptions(request.getPositiveOptions()))
                .negativeOptions(joinOptions(request.getNegativeOptions()))
                .freeText(request.getFreeText())
                .build();

        // 장소별 평가 추가
        if (request.getPlaceRatings() != null) {
            for (FeedbackRequest.PlaceRatingRequest pr : request.getPlaceRatings()) {
                String recommendation = convertRecommendation(pr.getRecommendation());
                FeedbackPlaceRating placeRating = FeedbackPlaceRating.builder()
                        .placeId(pr.getPlaceId())
                        .recommendation(recommendation)
                        .build();
                feedback.addPlaceRating(placeRating);
            }
        }

        Feedback saved = feedbackRepository.save(feedback);

        // 코스 평점 업데이트 (피드백 평균)
        Double avgRating = feedbackRepository.findAverageRatingByCourseId(course.getId());
        course.setRating(avgRating);
        courseRepository.save(course);

        log.info("피드백 제출 완료 - 피드백 ID: {}, 코스 평점 업데이트: {}", saved.getId(), avgRating);

        return toResponse(saved, courseId);
    }

    /**
     * 본인 피드백 조회
     */
    @Transactional(readOnly = true)
    public FeedbackResponse getFeedback(String courseId, String userId) {
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("코스를 찾을 수 없음: " + courseId));

        Feedback feedback = feedbackRepository.findByCourse_IdAndUserId(course.getId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("피드백을 찾을 수 없습니다."));

        return toResponse(feedback, courseId);
    }

    /**
     * 피드백 통계 조회 (공개)
     */
    @Transactional(readOnly = true)
    public FeedbackStatsResponse getFeedbackStats(String courseId) {
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("코스를 찾을 수 없음: " + courseId));

        Long totalCount = feedbackRepository.countByCourse_Id(course.getId());
        Double avgRating = feedbackRepository.findAverageRatingByCourseId(course.getId());

        // 평점 분포
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        List<Object[]> distribution = feedbackRepository.findRatingDistributionByCourseId(course.getId());
        for (Object[] row : distribution) {
            ratingDistribution.put((Integer) row[0], (Long) row[1]);
        }

        // 옵션 통계 집계
        List<Feedback> feedbacks = feedbackRepository.findByCourse_Id(course.getId());
        List<FeedbackStatsResponse.OptionCount> topPositive = aggregateOptions(feedbacks, true);
        List<FeedbackStatsResponse.OptionCount> topNegative = aggregateOptions(feedbacks, false);

        // 장소별 추천 통계
        List<Object[]> placeStats = feedbackPlaceRatingRepository
                .findPlaceRecommendationStatsByCourseId(course.getId());
        List<FeedbackStatsResponse.PlaceRecommendationStats> placeRecommendationStats =
                buildPlaceStats(placeStats);

        return FeedbackStatsResponse.builder()
                .courseId(courseId)
                .totalCount(totalCount)
                .averageRating(avgRating != null ? Math.round(avgRating * 10) / 10.0 : null)
                .ratingDistribution(ratingDistribution)
                .topPositiveOptions(topPositive)
                .topNegativeOptions(topNegative)
                .placeStats(placeRecommendationStats)
                .build();
    }

    /**
     * Feedback 엔티티 → FeedbackResponse 변환
     */
    private FeedbackResponse toResponse(Feedback feedback, String courseId) {
        List<FeedbackResponse.PlaceRatingResponse> placeRatings = feedback.getPlaceRatings().stream()
                .map(pr -> FeedbackResponse.PlaceRatingResponse.builder()
                        .placeId(pr.getPlaceId())
                        .recommendation(pr.getRecommendation())
                        .build())
                .toList();

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .courseId(courseId)
                .overallRating(feedback.getOverallRating())
                .positiveOptions(splitOptions(feedback.getPositiveOptions()))
                .negativeOptions(splitOptions(feedback.getNegativeOptions()))
                .placeRatings(placeRatings)
                .freeText(feedback.getFreeText())
                .createdAt(feedback.getCreatedAt() != null
                        ? feedback.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                        : null)
                .build();
    }

    /**
     * 옵션 리스트를 쉼표 구분 문자열로 변환
     */
    private String joinOptions(List<String> options) {
        if (options == null || options.isEmpty()) {
            return null;
        }
        return String.join(",", options);
    }

    /**
     * 쉼표 구분 문자열을 옵션 리스트로 변환
     */
    private List<String> splitOptions(String options) {
        if (options == null || options.isBlank()) {
            return List.of();
        }
        return Arrays.asList(options.split(","));
    }

    /**
     * 프론트엔드 추천 값을 DB 값으로 변환
     */
    private String convertRecommendation(String recommendation) {
        if ("recommend".equals(recommendation)) {
            return "RECOMMEND";
        } else if ("not_recommend".equals(recommendation)) {
            return "NOT_RECOMMEND";
        }
        throw new IllegalArgumentException("잘못된 추천 값: " + recommendation);
    }

    /**
     * 옵션 통계 집계 (좋았던 점 / 아쉬운 점)
     */
    private List<FeedbackStatsResponse.OptionCount> aggregateOptions(List<Feedback> feedbacks, boolean positive) {
        Map<String, Long> countMap = new HashMap<>();

        for (Feedback f : feedbacks) {
            String options = positive ? f.getPositiveOptions() : f.getNegativeOptions();
            if (options != null && !options.isBlank()) {
                for (String opt : options.split(",")) {
                    countMap.merge(opt.trim(), 1L, Long::sum);
                }
            }
        }

        return countMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> FeedbackStatsResponse.OptionCount.builder()
                        .optionId(e.getKey())
                        .count(e.getValue())
                        .build())
                .toList();
    }

    /**
     * 장소별 추천 통계 빌드
     */
    private List<FeedbackStatsResponse.PlaceRecommendationStats> buildPlaceStats(List<Object[]> rawStats) {
        // placeId → {RECOMMEND: count, NOT_RECOMMEND: count}
        Map<Long, Map<String, Long>> placeMap = new LinkedHashMap<>();

        for (Object[] row : rawStats) {
            Long placeId = (Long) row[0];
            String recommendation = (String) row[1];
            Long count = (Long) row[2];

            placeMap.computeIfAbsent(placeId, k -> new HashMap<>())
                    .put(recommendation, count);
        }

        return placeMap.entrySet().stream()
                .map(e -> FeedbackStatsResponse.PlaceRecommendationStats.builder()
                        .placeId(e.getKey())
                        .recommendCount(e.getValue().getOrDefault("RECOMMEND", 0L))
                        .notRecommendCount(e.getValue().getOrDefault("NOT_RECOMMEND", 0L))
                        .build())
                .toList();
    }
}
