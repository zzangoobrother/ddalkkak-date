package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 사용자 레포지토리
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 카카오 ID로 사용자 조회
     *
     * @param kakaoId 카카오 고유 ID
     * @return 사용자 Optional
     */
    Optional<User> findByKakaoId(String kakaoId);

    /**
     * 이메일로 사용자 조회
     *
     * @param email 이메일
     * @return 사용자 Optional
     */
    Optional<User> findByEmail(String email);

    /**
     * 카카오 ID 존재 여부 확인
     *
     * @param kakaoId 카카오 고유 ID
     * @return 존재 여부
     */
    boolean existsByKakaoId(String kakaoId);
}
