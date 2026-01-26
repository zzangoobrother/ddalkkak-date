"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ConfirmCourseModalProps {
  isOpen: boolean;
  isConfirming: boolean;
  courseName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 코스 확정 확인 모달
 */
export default function ConfirmCourseModal({
  isOpen,
  isConfirming,
  courseName,
  onConfirm,
  onCancel,
}: ConfirmCourseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh]"
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {/* 헤더 */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  이 코스로 데이트를 확정하시겠습니까?
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  <strong>&quot;{courseName}&quot;</strong>
                </p>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span>확정 후에도 코스를 수정하거나 다른 코스를 선택할 수 있습니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span>확정된 코스는 &apos;저장된 코스&apos; 목록에서 확인할 수 있습니다.</span>
                  </li>
                </ul>
              </div>

              {/* 버튼 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isConfirming}
                  className="py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isConfirming}
                  className="py-4 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isConfirming ? "확정 중..." : "확정하기"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
