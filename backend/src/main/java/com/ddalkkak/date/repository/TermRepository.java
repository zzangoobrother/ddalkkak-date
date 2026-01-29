package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Term;
import com.ddalkkak.date.entity.TermType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 약관 레포지토리
 */
@Repository
public interface TermRepository extends JpaRepository<Term, Long> {

    /**
     * 약관 종류로 최신 버전 약관 조회
     *
     * @param termType 약관 종류
     * @return 약관 Optional
     */
    Optional<Term> findFirstByTermTypeOrderByCreatedAtDesc(TermType termType);

    /**
     * 모든 최신 약관 조회
     *
     * @return 약관 목록
     */
    List<Term> findAllByOrderByCreatedAtDesc();

    /**
     * 필수 약관 조회
     *
     * @return 필수 약관 목록
     */
    List<Term> findByRequiredTrue();
}
