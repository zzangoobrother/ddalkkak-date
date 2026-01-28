"use client";

import { useState } from "react";
import LoginModal from "@/components/LoginModal";

/**
 * 로그인 모달 테스트 페이지
 */
export default function TestLoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
    console.log("로그인 성공! Access Token:", token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            로그인 모달 테스트
          </h1>
          <p className="text-text-secondary">
            SCRUM-27: 로그인 모달 및 카카오 OAuth UI 구현
          </p>
        </div>

        {/* 테스트 케이스 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            테스트 시나리오
          </h2>

          <div className="space-y-4 mb-6">
            {/* 시나리오 1 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  로그인 버튼 클릭
                </h3>
                <p className="text-sm text-text-secondary">
                  저장/공유/피드백 버튼 클릭 시 로그인 모달이 표시됩니다.
                </p>
              </div>
            </div>

            {/* 시나리오 2 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  약관 동의
                </h3>
                <p className="text-sm text-text-secondary">
                  필수 약관(서비스 이용약관, 개인정보 처리방침)에 동의해야
                  로그인 버튼이 활성화됩니다.
                </p>
              </div>
            </div>

            {/* 시나리오 3 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  카카오 로그인
                </h3>
                <p className="text-sm text-text-secondary">
                  &quot;카카오톡으로 계속하기&quot; 버튼 클릭 시 카카오 OAuth
                  로그인이 진행됩니다.
                </p>
              </div>
            </div>

            {/* 시나리오 4 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  나중에 하기
                </h3>
                <p className="text-sm text-text-secondary">
                  &quot;나중에 하기&quot; 버튼 클릭 시 모달이 닫히고 비로그인
                  상태로 계속 진행됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 트리거 버튼 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-text-primary mb-2">
              로그인 트리거
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
              >
                💾 저장하기
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-4 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-semibold transition-colors"
              >
                📤 공유하기
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                💬 피드백 보내기
              </button>
            </div>
          </div>
        </div>

        {/* 로그인 상태 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            로그인 상태
          </h2>

          {accessToken ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-green-600">
                  로그인 완료
                </span>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-1 font-mono">
                  Access Token:
                </p>
                <p className="text-sm text-gray-800 font-mono break-all">
                  {accessToken.substring(0, 50)}...
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAccessToken(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="font-semibold text-gray-600">
                  로그인 필요
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                위의 트리거 버튼을 클릭하여 로그인 모달을 테스트하세요.
              </p>
            </div>
          )}
        </div>

        {/* 주의사항 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>
              카카오 로그인을 테스트하려면 .env.local 파일에
              NEXT_PUBLIC_KAKAO_APP_KEY를 설정해야 합니다.
            </li>
            <li>
              현재는 프론트엔드만 구현된 상태로, 백엔드 API 연동은 추후
              진행됩니다.
            </li>
            <li>
              로그인 성공 시 카카오 액세스 토큰만 반환되며, JWT 토큰 발급은
              백엔드 구현 후 연동됩니다.
            </li>
          </ul>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
