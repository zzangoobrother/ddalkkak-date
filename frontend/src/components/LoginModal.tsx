"use client";

import { useState, useEffect } from "react";
import type { TermsAgreement } from "@/types/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (accessToken: string) => void;
}

/**
 * 로그인 모달 컴포넌트
 * - 카카오톡 OAuth 로그인
 * - 약관 동의 체크박스
 * - 나중에 하기 버튼
 */
export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [agreement, setAgreement] = useState<TermsAgreement>({
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setAgreement({
        terms: false,
        privacy: false,
        marketing: false,
      });
      setError(null);
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 전체 동의 토글
  const handleAllAgree = (checked: boolean) => {
    setAgreement({
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  // 개별 약관 토글
  const handleAgreementChange = (
    key: keyof TermsAgreement,
    checked: boolean
  ) => {
    setAgreement((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  // 필수 약관 동의 여부 확인
  const isRequiredAgreed = agreement.terms && agreement.privacy;

  // 전체 동의 여부 확인
  const isAllAgreed =
    agreement.terms && agreement.privacy && agreement.marketing;

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    if (!isRequiredAgreed) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Kakao SDK 확인
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        throw new Error("카카오 SDK가 초기화되지 않았습니다.");
      }

      // 카카오 로그인
      window.Kakao.Auth.login({
        success: async (authResponse) => {
          try {
            // 사용자 정보 조회
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: (userProfile) => {
                console.log("카카오 로그인 성공:", userProfile);

                // TODO: 백엔드 API 호출하여 JWT 토큰 발급
                // const response = await fetch('/api/auth/login', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({
                //     kakaoAccessToken: authResponse.access_token,
                //     agreedToTerms: agreement.terms,
                //     agreedToPrivacy: agreement.privacy,
                //     agreedToMarketing: agreement.marketing,
                //   }),
                // });

                // 임시: 액세스 토큰 반환
                if (onLoginSuccess) {
                  onLoginSuccess(authResponse.access_token);
                }

                setIsLoading(false);
                onClose();
              },
              fail: (error) => {
                throw error;
              },
            });
          } catch (err) {
            console.error("사용자 정보 조회 실패:", err);
            setError("사용자 정보를 가져오는데 실패했습니다.");
            setIsLoading(false);
          }
        },
        fail: (error) => {
          console.error("카카오 로그인 실패:", error);
          setError("카카오 로그인에 실패했습니다.");
          setIsLoading(false);
        },
      });
    } catch (err) {
      console.error("로그인 처리 중 오류:", err);
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다."
      );
      setIsLoading(false);
    }
  };

  // 나중에 하기
  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2
            id="login-modal-title"
            className="text-xl font-bold text-text-primary"
          >
            로그인
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 안내 문구 */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary">
              로그인하고 데이트 코스를 저장하고 공유해보세요!
            </p>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3 mb-6">
            {/* 전체 동의 */}
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={isAllAgreed}
                onChange={(e) => handleAllAgree(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="font-semibold text-text-primary">
                전체 동의
              </span>
            </label>

            <div className="space-y-2 pl-2">
              {/* 서비스 이용약관 (필수) */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreement.terms}
                  onChange={(e) =>
                    handleAgreementChange("terms", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
                  <span className="text-primary font-medium">[필수]</span>{" "}
                  서비스 이용약관
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: 약관 상세 페이지 열기
                    console.log("서비스 이용약관 상세 보기");
                  }}
                  className="ml-auto text-xs text-gray-500 hover:text-primary underline"
                >
                  보기
                </button>
              </label>

              {/* 개인정보 처리방침 (필수) */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreement.privacy}
                  onChange={(e) =>
                    handleAgreementChange("privacy", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
                  <span className="text-primary font-medium">[필수]</span>{" "}
                  개인정보 처리방침
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: 약관 상세 페이지 열기
                    console.log("개인정보 처리방침 상세 보기");
                  }}
                  className="ml-auto text-xs text-gray-500 hover:text-primary underline"
                >
                  보기
                </button>
              </label>

              {/* 마케팅 수신 동의 (선택) */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreement.marketing}
                  onChange={(e) =>
                    handleAgreementChange("marketing", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-primary transition-colors">
                  <span className="text-gray-500">[선택]</span> 마케팅 정보 수신
                  동의
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: 약관 상세 페이지 열기
                    console.log("마케팅 정보 수신 동의 상세 보기");
                  }}
                  className="ml-auto text-xs text-gray-500 hover:text-primary underline"
                >
                  보기
                </button>
              </label>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={!isRequiredAgreed || isLoading}
            className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD835] disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl font-semibold text-[#000000] transition-colors flex items-center justify-center gap-2 mb-3"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                로그인 중...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오톡으로 계속하기
              </>
            )}
          </button>

          {/* 나중에 하기 버튼 */}
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
