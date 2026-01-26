package com.ddalkkak.date.entity;

/**
 * 코스 상태 Enum
 */
public enum CourseStatus {
    DRAFT,      // 초기 생성 상태 (userId = null)
    SAVED,      // 저장된 상태 (userId != null)
    CONFIRMED   // 확정된 상태
}
