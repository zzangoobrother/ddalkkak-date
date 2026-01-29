package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.TermAgreement;
import com.ddalkkak.date.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 약관 동의 레포지토리
 */
@Repository
public interface TermAgreementRepository extends JpaRepository<TermAgreement, Long> {

    /**
     * 사용자의 모든 약관 동의 내역 조회
     *
     * @param user 사용자
     * @return 약관 동의 목록
     */
    List<TermAgreement> findByUser(User user);

    /**
     * 사용자의 특정 약관 동의 내역 조회
     *
     * @param userId 사용자 ID
     * @param termId 약관 ID
     * @return 약관 동의 목록
     */
    List<TermAgreement> findByUserIdAndTermId(Long userId, Long termId);
}
