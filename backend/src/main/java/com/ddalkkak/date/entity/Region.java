package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 서울 지역 엔티티
 */
@Entity
@Table(name = "regions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Region {

    /**
     * 지역 ID (Primary Key)
     */
    @Id
    @Column(length = 50)
    private String id;

    /**
     * 지역 이름 (예: "마포·홍대")
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * 지역 이모지 (예: "🎨")
     */
    @Column(nullable = false, length = 10)
    private String emoji;

    /**
     * 지역 태그라인 (예: "예술과 청춘의 거리")
     */
    @Column(nullable = false, length = 200)
    private String tagline;

    /**
     * 그리드 행 위치 (0-based)
     */
    @Column(nullable = false)
    private Integer gridRow;

    /**
     * 그리드 열 위치 (0-based)
     */
    @Column(nullable = false)
    private Integer gridCol;

    /**
     * 표시 순서
     */
    @Column(nullable = false)
    private Integer displayOrder;

}
