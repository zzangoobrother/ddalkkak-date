"use client";

import { FEEDBACK_TEXT_MAX_LENGTH } from "@/lib/constants";

interface FeedbackTextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 자유 텍스트 입력 영역 (글자 수 카운터 포함)
 */
export default function FeedbackTextArea({
  value,
  onChange,
}: FeedbackTextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= FEEDBACK_TEXT_MAX_LENGTH) {
      onChange(text);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="text-base font-bold text-text-primary mb-4">
        하고 싶은 말 (선택)
      </h3>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="데이트에 대한 솔직한 의견을 남겨주세요..."
          rows={3}
          maxLength={FEEDBACK_TEXT_MAX_LENGTH}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm text-text-primary placeholder-gray-400 resize-none focus:outline-none focus:border-primary transition-colors"
        />
        <div className="absolute bottom-3 right-3 text-xs text-text-secondary">
          {value.length}/{FEEDBACK_TEXT_MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}
