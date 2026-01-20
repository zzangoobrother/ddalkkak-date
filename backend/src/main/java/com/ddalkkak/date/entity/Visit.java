package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 지역 방문 기록 엔티티 (Hot 지역 판별용)
 */
@Entity
@Table(name = "visits", indexes = {
    @Index(name = "idx_region_id_created_at", columnList = "region_id,created_at")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visit {

    /**
     * 방문 기록 ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 지역 ID
     */
    @Column(name = "region_id", nullable = false, length = 50)
    private String regionId;

    /**
     * 방문 일시
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}
